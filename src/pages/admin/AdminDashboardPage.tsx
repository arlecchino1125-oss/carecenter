import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { Trash2, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

const FALLBACK_DEPARTMENTS: string[] = [
    'College of Arts and Sciences',
    'College of Engineering',
    'College of Education',
    'College of Agriculture and Forestry',
    'College of Criminal Justice Education',
    'College of Information Technology',
    'College of Nursing',
    'College of Business'
];

const STORAGE_BUCKET_FALLBACK: string[] = ['attendance_proofs', 'support_documents'];

const TABLES_TO_CLEAR: string[] = [
    'answers',
    'event_feedback',
    'event_attendance',
    'scholarship_applications',
    'notifications',
    'needs_assessments',
    'office_visits',
    'support_requests',
    'counseling_requests',
    'general_feedback',
    'submissions',
    'questions',
    'applications',
    'enrolled_students',
    'scholarships',
    'events',
    'forms',
    'students',
    'office_visit_reasons',
    'courses',
    'admission_schedules',
    'audit_logs',
    'departments'
];

const normalizeEmail = (value: any) => String(value || '').trim().toLowerCase();

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { session, isAuthenticated, logout } = useAuth() as any;
    const [loading, setLoading] = useState<boolean>(false);
    const [departmentLoading, setDepartmentLoading] = useState<boolean>(false);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [departments, setDepartments] = useState<string[]>(FALLBACK_DEPARTMENTS);
    const [newDepartment, setNewDepartment] = useState<string>('');
    const [form, setForm] = useState<any>({ username: '', password: '', full_name: '', role: 'Department Head', department: '', email: '' });
    const [toast, setToast] = useState<any>(null);
    const [showResetModal, setShowResetModal] = useState<boolean>(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin');
        } else {
            fetchAccounts();
            fetchDepartments();
        }
    }, [isAuthenticated, navigate]);

    const showToast = (msg: string, type: string = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchAccounts = async () => {
        const { data } = await supabase.from('staff_accounts').select('*').order('created_at', { ascending: false });
        if (data) setAccounts(data);
    };

    const fetchDepartments = async () => {
        const { data, error } = await supabase.from('departments').select('name').order('name', { ascending: true });
        if (!error && data) {
            setDepartments(data.map((d: any) => d.name));
        } else {
            setDepartments(FALLBACK_DEPARTMENTS);
        }
    };

    const handleAddDepartment = async (e: any) => {
        e.preventDefault();
        const name = newDepartment.trim();
        if (!name) {
            showToast("Department name is required.", 'error');
            return;
        }
        if (departments.some(d => d.toLowerCase() === name.toLowerCase())) {
            showToast("Department already exists.", 'error');
            return;
        }

        setDepartmentLoading(true);
        try {
            const { error } = await supabase.from('departments').insert([{ name }]);
            if (error) throw error;
            setNewDepartment('');
            await fetchDepartments();
            showToast("Department added successfully!");
        } catch (err: any) {
            showToast(err.message || "Failed to add department.", 'error');
        } finally {
            setDepartmentLoading(false);
        }
    };

    const handleDeleteDepartment = async (name: string) => {
        if (!confirm(`Delete department "${name}"?`)) return;
        setDepartmentLoading(true);
        try {
            const { error } = await supabase.from('departments').delete().eq('name', name);
            if (error) throw error;
            if (form.department === name) {
                setForm({ ...form, department: '' });
            }
            await fetchDepartments();
            showToast("Department deleted.");
        } catch (err: any) {
            if (err.code === '23503') {
                showToast("Cannot delete department because it is still referenced by existing records.", 'error');
            } else {
                showToast(err.message || "Failed to delete department.", 'error');
            }
        } finally {
            setDepartmentLoading(false);
        }
    };

    const handleCreate = async (e: any) => {
        e.preventDefault();
        const payload = { ...form };
        payload.username = payload.username.trim();
        payload.email = normalizeEmail(payload.email);

        if (!payload.email) {
            showToast("Email is required for secure account login.", 'error');
            return;
        }

        if (!payload.password || payload.password.length < 6) {
            showToast("Password must be at least 6 characters.", 'error');
            return;
        }

        if (payload.role !== 'Department Head') delete payload.department;

        const { error } = await supabase.from('staff_accounts').insert([payload]);
        if (error) {
            showToast(error.message, 'error');
            return;
        }

        try {
            const { data, error: provisionError } = await supabase.functions.invoke('provision-auth-user', {
                body: {
                    email: payload.email,
                    password: payload.password,
                    user_metadata: {
                        source_table: 'staff_accounts',
                        app_role: payload.role || 'Staff',
                        username: payload.username || null,
                        full_name: payload.full_name || null
                    }
                }
            });

            if (provisionError) {
                showToast(`Account saved but auth setup failed: ${provisionError.message}`, 'error');
            } else if (data?.status === 'created') {
                showToast("Account and auth login created successfully.");
            } else if (data?.status === 'updated') {
                showToast("Account saved. Existing auth login was updated.");
            } else {
                showToast("Account saved. Auth login is ready.");
            }
        } catch (err: any) {
            showToast(`Account saved but auth setup failed: ${err.message}`, 'error');
        }

        setForm({ username: '', password: '', full_name: '', role: 'Department Head', department: '', email: '' });
        fetchAccounts();
    };

    const handleDelete = async (id: any) => {
        if (!confirm("Delete this account?")) return;
        await supabase.from('staff_accounts').delete().eq('id', id);
        fetchAccounts();
    };

    const handleReset = async () => {
        setShowResetModal(false);
        setLoading(true);
        try {
            const resetErrors: string[] = [];

            // Keep current admin session account, remove all other staff.
            const { error: clearCurrentAdminDeptError } = await supabase
                .from('staff_accounts')
                .update({ department: null })
                .eq('id', session.id);
            if (clearCurrentAdminDeptError) resetErrors.push(`staff_accounts(update current admin): ${clearCurrentAdminDeptError.message}`);

            const { error: staffError } = await supabase
                .from('staff_accounts')
                .delete()
                .neq('id', session.id);
            if (staffError) resetErrors.push(`staff_accounts(delete others): ${staffError.message}`);

            // Clear all configured database tables.
            for (const table of TABLES_TO_CLEAR) {
                if (table === 'enrolled_students') {
                    const { error } = await supabase.from(table).delete().neq('student_id', '');
                    if (error) resetErrors.push(`${table}: ${error.message}`);
                } else {
                    const { error } = await supabase.from(table).delete().not('id', 'is', null);
                    if (error) resetErrors.push(`${table}: ${error.message}`);
                }
            }

            // Clear all files from storage buckets.
            let bucketNames: string[] = [];
            const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
            if (!bucketsError && buckets && buckets.length > 0) {
                bucketNames = buckets.map((b: any) => b.name);
            } else {
                bucketNames = STORAGE_BUCKET_FALLBACK;
            }

            const collectBucketFiles = async (bucketName: string, prefix: string = ''): Promise<string[]> => {
                const files: string[] = [];
                let offset = 0;
                while (true) {
                    const { data, error } = await supabase.storage
                        .from(bucketName)
                        .list(prefix, { limit: 100, offset, sortBy: { column: 'name', order: 'asc' } });
                    if (error) throw error;
                    if (!data || data.length === 0) break;

                    for (const item of data as any[]) {
                        const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
                        if (item.id === null) {
                            const nestedFiles = await collectBucketFiles(bucketName, itemPath);
                            files.push(...nestedFiles);
                        } else {
                            files.push(itemPath);
                        }
                    }

                    if (data.length < 100) break;
                    offset += 100;
                }
                return files;
            };

            for (const bucketName of bucketNames) {
                try {
                    const filePaths = await collectBucketFiles(bucketName);
                    for (let i = 0; i < filePaths.length; i += 100) {
                        const chunk = filePaths.slice(i, i + 100);
                        if (chunk.length === 0) continue;
                        const { error } = await supabase.storage.from(bucketName).remove(chunk);
                        if (error) throw error;
                    }
                } catch (err: any) {
                    resetErrors.push(`storage:${bucketName}: ${err.message || String(err)}`);
                }
            }

            if (resetErrors.length > 0) {
                showToast(`Reset completed with warnings: ${resetErrors[0]}`, 'error');
            } else {
                showToast("System data and storage files have been successfully reset.");
            }

            fetchAccounts();
            fetchDepartments();
        } catch (err: any) {
            showToast("Error resetting: " + err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    if (!session) return null;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
                    <div className="flex gap-4">
                        <button onClick={() => setShowResetModal(true)} className="text-red-600 font-bold hover:underline">Reset System</button>
                        <button onClick={handleLogout} className="text-gray-600 font-bold hover:underline">Logout</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
                        <h2 className="font-bold text-lg mb-4">Create New Account</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Role</label><select className="w-full border p-2 rounded" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option>Department Head</option><option value="Care Staff">CARE Staff</option><option>Admin</option></select></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label><input required className="w-full border p-2 rounded" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Username</label><input required className="w-full border p-2 rounded" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Password</label><input required className="w-full border p-2 rounded" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Email</label><input required type="email" className="w-full border p-2 rounded" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>

                            {form.role === 'Department Head' && (
                                <div><label className="block text-xs font-bold text-gray-500 mb-1">Department</label><select className="w-full border p-2 rounded" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}><option value="">Select Department</option>{departments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                            )}

                            <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Create Account</button>
                        </form>

                        <div className="mt-8 pt-6 border-t">
                            <h3 className="font-bold text-base mb-3">Department Management</h3>
                            <form onSubmit={handleAddDepartment} className="flex gap-2 mb-3">
                                <input
                                    className="flex-1 border p-2 rounded"
                                    value={newDepartment}
                                    onChange={e => setNewDepartment(e.target.value)}
                                    placeholder="Add new department"
                                />
                                <button
                                    type="submit"
                                    disabled={departmentLoading}
                                    className={`px-3 py-2 rounded font-bold text-white ${departmentLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                                >
                                    Add
                                </button>
                            </form>

                            <div className="border rounded-lg divide-y max-h-56 overflow-y-auto">
                                {departments.length === 0 && (
                                    <div className="p-3 text-sm text-gray-500">No departments found.</div>
                                )}
                                {departments.map((d: string) => (
                                    <div key={d} className="p-3 flex items-center justify-between gap-3">
                                        <span className="text-sm text-gray-700">{d}</span>
                                        <button
                                            type="button"
                                            disabled={departmentLoading}
                                            onClick={() => handleDeleteDepartment(d)}
                                            className={`text-xs font-bold px-2 py-1 rounded ${departmentLoading ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-red-600 bg-red-50 hover:bg-red-100'}`}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[11px] text-gray-500 mt-2">Tip: Department deletion can fail if existing records still reference it.</p>
                        </div>
                    </div>

                    {/* Account List */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b"><h2 className="font-bold text-lg">Existing Accounts ({accounts.length})</h2></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b"><tr><th className="p-4">Name</th><th className="p-4">Role</th><th className="p-4">Details</th><th className="p-4">Username</th><th className="p-4">Password</th><th className="p-4 text-right">Action</th></tr></thead>
                                <tbody className="divide-y">
                                    {accounts.map((acc: any) => (
                                        <tr key={acc.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-bold">{acc.full_name}</td>
                                            <td className="p-4"><span className={`px-2 py-1 rounded text-xs text-white ${acc.role === 'Admin' ? 'bg-red-500' : acc.role === 'Care Staff' ? 'bg-purple-500' : 'bg-green-500'}`}>{acc.role === 'Care Staff' ? 'CARE Staff' : acc.role}</span></td>
                                            <td className="p-4 text-gray-500">{acc.department || '-'}</td>
                                            <td className="p-4 font-mono">{acc.username}</td>
                                            <td className="p-4 font-mono text-gray-500">{acc.password}</td>
                                            <td className="p-4 text-right"><button onClick={() => handleDelete(acc.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {toast && (
                    <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl text-white flex items-center gap-3 animate-slide-in-up z-50 ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
                        <div className="text-xl">{toast.type === 'error' ? <AlertCircle /> : <CheckCircle />}</div>
                        <div><h4 className="font-bold text-sm">{toast.type === 'error' ? 'Error' : 'Success'}</h4><p className="text-xs opacity-90">{toast.msg}</p></div>
                    </div>
                )}

                {showResetModal && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-slide-in-up">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"><AlertTriangle /></div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Danger Zone</h3>
                                <p className="text-gray-500 text-sm mb-6">This will wipe ALL application data in database tables and clear storage bucket files. All other staff accounts will be deleted; only your current Admin account remains.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowResetModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50">Cancel</button>
                                    <button onClick={handleReset} disabled={loading} className={`flex-1 px-4 py-2.5 text-white font-bold rounded-lg ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200'}`}>Confirm Reset</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


