import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext(null);
const LEGACY_AUTH_FALLBACK = String(import.meta.env.VITE_ENABLE_LEGACY_AUTH_FALLBACK ?? 'true').toLowerCase() !== 'false';
const normalizeEmail = (value: any) => String(value || '').trim().toLowerCase();

export function AuthProvider({ children }: any) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const persistSession = useCallback((sessionData: any) => {
        setSession(sessionData);
        localStorage.setItem('norsu_session', JSON.stringify(sessionData));
    }, []);

    const clearSession = useCallback(() => {
        setSession(null);
        localStorage.removeItem('norsu_session');
    }, []);

    const buildStaffSession = useCallback((staff: any, authMode: 'supabase' | 'legacy') => ({
        ...staff,
        userType: 'staff',
        user: { id: staff.id, email: normalizeEmail(staff.email) },
        authMode
    }), []);

    const buildStudentSession = useCallback((student: any, authMode: 'supabase' | 'legacy') => ({
        ...student,
        role: 'Student',
        userType: 'student',
        user: { id: student.student_id, email: normalizeEmail(student.email) },
        authMode
    }), []);

    const hydrateSessionFromEmail = useCallback(async (email: any) => {
        const normalized = normalizeEmail(email);
        if (!normalized) return null;

        const { data: staff, error: staffError } = await supabase
            .from('staff_accounts')
            .select('*')
            .ilike('email', normalized)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (staffError) throw staffError;
        if (staff) return buildStaffSession(staff, 'supabase');

        const { data: student, error: studentError } = await supabase
            .from('students')
            .select('*')
            .ilike('email', normalized)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (studentError) throw studentError;
        if (student) return buildStudentSession(student, 'supabase');

        return null;
    }, [buildStaffSession, buildStudentSession]);

    /**
     * Login against staff_accounts table.
     * @param {string} loginId - username or email
     * @param {string} password
     * @param {string} requiredRole - e.g. 'Admin', 'Department Head', 'Care Staff'
     * @returns {{ success: boolean, error?: string, data?: object }}
     */
    /**
     * Login for Staff (Admin, Department Head, Care Staff)
     */
    const loginStaff = useCallback(async (loginId: any, password: any, requiredRole: any) => {
        setLoading(true);
        try {
            const loginIdentifier = String(loginId || '').trim();
            if (!loginIdentifier) {
                return { success: false, error: 'Enter your email or username.' };
            }

            let staffEmail = '';
            if (loginIdentifier.includes('@')) {
                staffEmail = normalizeEmail(loginIdentifier);
            } else {
                const { data: resolved, error: resolveError } = await supabase.functions.invoke('resolve-staff-login', {
                    body: { loginId: loginIdentifier, password }
                });

                if (resolveError) {
                    return { success: false, error: 'Invalid username or password.' };
                }

                staffEmail = normalizeEmail(resolved?.email);
                if (!staffEmail) {
                    return { success: false, error: 'Invalid username or password.' };
                }
            }

            let authMode: 'supabase' | 'legacy' = 'supabase';

            // Ensure each login attempt starts from a clean auth state.
            await supabase.auth.signOut({ scope: 'local' });

            const { error: authError } = await supabase.auth.signInWithPassword({
                email: staffEmail,
                password
            });

            if (authError) {
                if (LEGACY_AUTH_FALLBACK) {
                    const { data: staffLegacy, error: legacyError } = await supabase
                        .from('staff_accounts')
                        .select('*')
                        .ilike('email', staffEmail)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle();

                    if (legacyError) throw legacyError;
                    if (!staffLegacy) {
                        return { success: false, error: 'Account not found.' };
                    }
                    if (staffLegacy.role !== requiredRole) {
                        return { success: false, error: `Access denied: This account is not a ${requiredRole}.` };
                    }
                    if (staffLegacy.password !== password) {
                        return { success: false, error: 'Incorrect password.' };
                    }
                    authMode = 'legacy';
                    const sessionData = buildStaffSession(staffLegacy, authMode);
                    persistSession(sessionData);
                    return { success: true, data: sessionData };
                }
                return { success: false, error: 'Incorrect password.' };
            }

            const { data: staff, error: staffError } = await supabase
                .from('staff_accounts')
                .select('*')
                .ilike('email', staffEmail)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (staffError) throw staffError;
            if (!staff) {
                await supabase.auth.signOut();
                return { success: false, error: 'Staff profile not found for this email.' };
            }

            if (staff.role !== requiredRole) {
                await supabase.auth.signOut();
                return { success: false, error: `Access denied: This account is not a ${requiredRole}.` };
            }

            const sessionData = buildStaffSession(staff, authMode);
            persistSession(sessionData);

            return { success: true, data: sessionData };
        } catch (err: any) {
            return { success: false, error: 'Connection error: ' + err.message };
        } finally {
            setLoading(false);
        }
    }, [buildStaffSession, persistSession]);

    /**
     * Login for Students
     */
    const loginStudent = useCallback(async (email: any, password: any) => {
        setLoading(true);
        try {
            const normalizedEmail = normalizeEmail(email);
            if (!normalizedEmail) {
                return { success: false, error: 'Email is required.' };
            }

            let authMode: 'supabase' | 'legacy' = 'supabase';

            // Ensure each login attempt starts from a clean auth state.
            await supabase.auth.signOut({ scope: 'local' });

            const { error: authError } = await supabase.auth.signInWithPassword({
                email: normalizedEmail,
                password
            });

            if (authError) {
                if (LEGACY_AUTH_FALLBACK) {
                    const { data: studentLegacy, error: legacyError } = await supabase
                        .from('students')
                        .select('*')
                        .ilike('email', normalizedEmail)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle();

                    if (legacyError) throw legacyError;
                    if (!studentLegacy) {
                        return { success: false, error: 'Email not found.' };
                    }
                    if (studentLegacy.password !== password) {
                        return { success: false, error: 'Incorrect password.' };
                    }
                    authMode = 'legacy';
                    const sessionData = buildStudentSession(studentLegacy, authMode);
                    persistSession(sessionData);
                    return { success: true, data: sessionData };
                }
                return { success: false, error: 'Incorrect password.' };
            }

            const { data: student, error } = await supabase
                .from('students')
                .select('*')
                .ilike('email', normalizedEmail)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) throw error;

            if (!student) {
                await supabase.auth.signOut();
                return { success: false, error: 'Student profile not found for this email.' };
            }

            if (student.status !== 'Active' && student.status !== 'Probation') { // Allow Active/Probation
                await supabase.auth.signOut();
                return { success: false, error: 'Account is not active.' };
            }

            const sessionData = buildStudentSession(student, authMode);
            persistSession(sessionData);

            return { success: true, data: sessionData };
        } catch (err: any) {
            return { success: false, error: 'Login error: ' + err.message };
        } finally {
            setLoading(false);
        }
    }, [buildStudentSession, persistSession]);

    // Alias for backward compatibility with existing staff login pages
    const login = loginStaff;

    // Load session from localStorage on mount
    React.useEffect(() => {
        let mounted = true;

        const restoreSession = async () => {
            try {
                const { data: authData } = await supabase.auth.getSession();
                const authEmail = normalizeEmail(authData?.session?.user?.email);

                if (authEmail) {
                    const hydrated = await hydrateSessionFromEmail(authEmail);
                    if (mounted && hydrated) {
                        persistSession(hydrated);
                        return;
                    }
                }

                const stored = localStorage.getItem('norsu_session');
                if (stored && mounted && LEGACY_AUTH_FALLBACK) {
                    try {
                        setSession(JSON.parse(stored));
                    } catch (e) {
                        localStorage.removeItem('norsu_session');
                    }
                } else if (stored && !LEGACY_AUTH_FALLBACK) {
                    // In strict auth mode, never trust stale local fallback sessions.
                    localStorage.removeItem('norsu_session');
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        restoreSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, authSession) => {
            if (!mounted) return;

            if (event === 'SIGNED_OUT') {
                clearSession();
                return;
            }

            const authEmail = normalizeEmail(authSession?.user?.email);
            if (!authEmail) return;

            try {
                const hydrated = await hydrateSessionFromEmail(authEmail);
                if (mounted && hydrated) {
                    persistSession(hydrated);
                }
            } catch (err) {
                console.error('Failed to hydrate auth session:', err);
            }
        });

        return () => {
            mounted = false;
            authListener.subscription.unsubscribe();
        };
    }, [clearSession, hydrateSessionFromEmail, persistSession]);

    const logout = useCallback(async () => {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            // Keep local logout deterministic even if signOut request fails.
        } finally {
            clearSession();
        }
    }, [clearSession]);

    const value = React.useMemo(() => ({
        session,
        loading,
        login,      // Alias for loginStaff
        loginStaff,
        loginStudent, // New student login
        logout,
        legacyAuthFallbackEnabled: LEGACY_AUTH_FALLBACK,
        isAuthenticated: !!session,
    }), [session, loading, login, loginStaff, loginStudent, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

