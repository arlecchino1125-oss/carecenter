import React, { useState, useEffect } from 'react';
import { exportToExcel, savePdf } from '../../../utils/dashboardUtils';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Chart } from 'chart.js/auto';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const STORAGE_KEY = 'norsu_care_data_v2';

const useCareStaffDashboardController = () => {
    const navigate = useNavigate();
    const { session, isAuthenticated, logout } = useAuth() as any;
    const [activeTab, setActiveTab] = useState<string>('home');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    // Session guard — redirect to login if no session
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/care-staff');
        }
    }, [isAuthenticated, navigate]);

    // Data States
    // Removed stats state in favor of useMemo
    const [applications, setApplications] = useState<any[]>([]);
    const [counselingReqs, setCounselingReqs] = useState<any[]>([]);
    const [supportReqs, setSupportReqs] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [allDepartments, setAllDepartments] = useState<any[]>([]);

    // Derived Stats (Performance Optimization: Removed extra re-render)
    const stats = React.useMemo(() => ({
        totalApplications: (applications?.length || 0),
        pending: (applications?.filter(a => a.status === 'Pending').length || 0),
        approved: (applications?.filter(a => a.status === 'Approved').length || 0),
        counseling: (counselingReqs?.filter(c => c.status === 'Pending' || c.status === 'Referred').length || 0),
        support: (supportReqs?.filter(s => s.status === 'Pending' || s.status === 'Forwarded to Dept').length || 0)
    }), [applications, counselingReqs, supportReqs]);

    // Modals
    const [showApplicationModal, setShowApplicationModal] = useState<boolean>(false);
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
    const [scheduleData, setScheduleData] = useState<any>({ date: '', time: '', notes: '' });
    const [showEventModal, setShowEventModal] = useState<boolean>(false);
    const [showDeleteEventModal, setShowDeleteEventModal] = useState<boolean>(false);
    const [eventToDelete, setEventToDelete] = useState<any>(null);
    const [newEvent, setNewEvent] = useState<any>({ title: '', description: '', event_date: '', event_time: '', end_time: '', location: '', latitude: '', longitude: '', type: 'Event' });
    const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
    const [completionForm, setCompletionForm] = useState<any>({ id: null, student_id: null, publicNotes: '', privateNotes: '' });
    const [toast, setToast] = useState<any>(null);
    const [showResetModal, setShowResetModal] = useState<boolean>(false);

    // Student Management State (Lifted from StudentPopulationPage)
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [editForm, setEditForm] = useState<any>({});
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [studentToDelete, setStudentToDelete] = useState<any>(null);

    // Scholarship State (New)
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [showScholarshipModal, setShowScholarshipModal] = useState<boolean>(false);
    const [showApplicantModal, setShowApplicantModal] = useState<boolean>(false);
    const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
    const [scholarshipForm, setScholarshipForm] = useState<any>({ title: '', description: '', requirements: '', deadline: '' });
    const [applicantsList, setApplicantsList] = useState<any[]>([]);

    // Command Hub (FAB Panel)
    const [showCommandHub, setShowCommandHub] = useState<boolean>(false);
    const [commandHubTab, setCommandHubTab] = useState<string>('actions');
    const [staffNotes, setStaffNotes] = useState<any[]>(() => {
        try { return JSON.parse(localStorage.getItem('care_staff_notes') || '[]'); } catch { return []; }
    });

    // Sub-tabs
    const [counselingTab, setCounselingTab] = useState<string>('Referred');
    const [supportTab, setSupportTab] = useState<string>('queue');

    // Filters
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [supportCategory, setSupportCategory] = useState<string>('All');

    // Support Modal
    const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
    const [selectedSupportReq, setSelectedSupportReq] = useState<any>(null);
    const [supportForm, setSupportForm] = useState<any>({ care_notes: '', resolution_notes: '' });
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [showCounselingFormModal, setShowCounselingFormModal] = useState<boolean>(false);
    const [viewFormReq, setViewFormReq] = useState<any>(null);
    const [formModalView, setFormModalView] = useState<string>('referral');

    // Events Extras
    const [showAttendeesModal, setShowAttendeesModal] = useState<boolean>(false);
    const [attendees, setAttendees] = useState<any[]>([]);
    const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
    const [feedbackList, setFeedbackList] = useState<any[]>([]);
    const [selectedEventTitle, setSelectedEventTitle] = useState<string>('');
    const [attendeeFilter, setAttendeeFilter] = useState<string>('All');
    const [yearLevelFilter, setYearLevelFilter] = useState<string>('All');
    const [attendeeCourseFilter, setAttendeeCourseFilter] = useState<string>('All');
    const [attendeeSectionFilter, setAttendeeSectionFilter] = useState<string>('All');
    const [eventFilter, setEventFilter] = useState<string>('All Items');
    const [editingEventId, setEditingEventId] = useState<any>(null);

    useEffect(() => {
        // Authenticate (Simple check as per original)
        // In real app, we should have a proper login page for Care Staff too, 
        // but for now we assume they access this route directly or via existing methods.
        // We can check if a "care_session" exists or similar, but original code used 
        // local storage key 'norsu_care_data_v2' primarily for some settings.
        // We'll proceed with data fetching.
        fetchData();

        // Realtime Subscription
        const channel = supabase.channel('care_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchData(true))
            // Counseling requests handled by separate channel now
            .on('postgres_changes', { event: '*', schema: 'public', table: 'support_requests' }, (payload: any) => {
                fetchData(true);
                if (payload.eventType === 'INSERT') {
                    showToastMessage(`New Support Request Received`, 'info');
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'event_attendance' }, () => fetchData(true))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => fetchData(true))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => fetchData(true))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'scholarships' }, () => fetchData(true))
            .subscribe();

        // Real-time feedback notifications (matches HTML App shell)
        const feedbackChannel = supabase.channel('care_staff_notifications')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'counseling_requests' }, (payload: any) => {
                if (payload.new.feedback && payload.new.status === 'Completed') {
                    setToast({ msg: `Counseling feedback received from ${payload.new.student_name}`, type: 'success' });
                    setTimeout(() => setToast(null), 6000);
                }
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'event_feedback' }, (payload: any) => {
                setToast({ msg: `New event rating received from ${payload.new.student_name}`, type: 'info' });
                setTimeout(() => setToast(null), 6000);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); supabase.removeChannel(feedbackChannel); };
    }, []);

    const fetchData = async (isBackground: boolean = false) => {
        if (!isBackground) setLoading(true);
        try {
            // 1. Fetch Applications (NAT)
            const { data: apps } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
            setApplications(apps || []);

            // 2. Fetch Counseling - MOVED TO SEPARATE EFFECT
            // const { data: couns } = await supabase.from('counseling_requests').select('*').order('created_at', { ascending: false });
            // setCounselingReqs(couns || []);

            // 3. Fetch Support - MOVED TO SEPARATE EFFECT
            // const { data: supp } = await supabase.from('support_requests').select('*').order('created_at', { ascending: false });
            // setSupportReqs(supp || []);

            // 4. Events
            const { data: evts } = await supabase.from('events').select('*').order('created_at', { ascending: false });
            setEvents(evts || []);

            // 5. Students
            const { data: studs, error: studErr } = await supabase.from('students').select('*').order('created_at', { ascending: false });
            if (studErr) console.error('[CareStaff] Error fetching students:', studErr);
            console.log('[CareStaff] Fetched students:', studs?.length || 0);
            setStudents(studs || []);

            // 6. Courses
            const { data: courses } = await supabase.from('courses').select('*').order('name', { ascending: true });
            setAllCourses(courses || []);

            // 7. Departments
            const { data: depts } = await supabase.from('departments').select('*').order('name', { ascending: true });
            setAllDepartments(depts || []);

            // 7. Scholarships
            const { data: sch } = await supabase.from('scholarships').select('*').order('created_at', { ascending: false });
            setScholarships(sch || []);

            // Stats update removed (now handled by useMemo)
        } catch (err: any) {
            console.error(err);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    const [isRefreshing, setIsRefreshing] = useState(false);
    const refreshAll = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([
                fetchData(true),
                fetchCounseling(),
                (async () => {
                    const { data: supp } = await supabase.from('support_requests').select('*').order('created_at', { ascending: false });
                    if (supp) setSupportReqs(supp);
                })(),
            ]);
            showToastMessage('Dashboard refreshed!', 'success');
        } catch (err: any) {
            console.error(err);
            showToastMessage('Refresh failed', 'error');
        } finally {
            setIsRefreshing(false);
        }
    };

    // Auto-calculate stats effect removed (handled by useMemo)

    // SEPARATE COUNSELING FETCHING AND SUBSCRIPTION (LIKE DEPT DASHBOARD)
    const fetchCounseling = async () => {
        const { data: couns } = await supabase.from('counseling_requests').select('*').order('created_at', { ascending: false });
        if (couns) {
            setCounselingReqs(couns);
        }
    };

    useEffect(() => {
        fetchCounseling();

        const channel = supabase.channel('care_counseling_isolated')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'counseling_requests' }, (payload: any) => {
                console.log("CareStaff: Isolated Counseling Update:", payload);
                fetchCounseling();
                if (payload.eventType === 'INSERT') {
                    showToastMessage(`New Counseling Request Received`, 'info');
                } else if (payload.eventType === 'UPDATE' && payload.new?.status === 'Referred') {
                    showToastMessage(`Counseling Request Forwarded by Dept Head`, 'info');
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // SEPARATE SUPPORT FETCHING AND SUBSCRIPTION (Fixed: Real-time updates from Dept)
    useEffect(() => {
        const fetchSupport = async () => {
            const { data: supp } = await supabase.from('support_requests').select('*').order('created_at', { ascending: false });
            if (supp) {
                // console.log("CareStaff: Independent Support Fetch:", supp.length);
                setSupportReqs(supp);
            }
        };

        fetchSupport();

        const channel = supabase.channel('care_support_isolated')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'support_requests' }, (payload: any) => {
                console.log("CareStaff: Isolated Support Update:", payload);
                fetchSupport();
                if (payload.eventType === 'INSERT') {
                    showToastMessage(`New Support Request Received`, 'info');
                } else if (payload.eventType === 'UPDATE') {
                    showToastMessage(`Support Request Updated`, 'info');
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // SEPARATE SCHOLARSHIP FETCHING AND SUBSCRIPTION
    useEffect(() => {
        const fetchScholarships = async () => {
            const { data: schols } = await supabase.from('scholarships').select('*').order('created_at', { ascending: false });
            if (schols) {
                setScholarships(schols);
            }
        };

        fetchScholarships();

        const channel = supabase.channel('care_scholarship_isolated')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'scholarships' }, () => fetchScholarships())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const showToastMessage = (msg: string, type: string = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const logAudit = async (action: any, details: any) => {
        try {
            const { error } = await supabase.from('audit_logs').insert([{
                user_id: session?.id || 'unknown',
                user_name: session?.full_name || 'CARE Staff',
                action,
                details
            }]);
            if (error) console.error('Audit log error:', error);
        } catch (err: any) {
            console.error('Audit log error:', err);
        }
    };

    const functions = {
        showToast: showToastMessage,
        logAudit,
        handleGetStarted: () => setActiveTab('dashboard'),
        handleDocs: () => window.open('https://norsu.edu.ph', '_blank'),
        handleLaunchModule: (module: any) => {
            if (module === 'Student Analytics') setActiveTab('analytics');
            if (module === 'Form Management') setActiveTab('forms');
            if (module === 'Event Broadcasting') setActiveTab('events');
            if (module === 'Scholarship Tracking') setActiveTab('scholarship');
        },
        handleOpenAnalytics: () => setActiveTab('analytics'),

        handleStatClick: (stat: any) => {
            if (stat === 'students') setActiveTab('population'); // Updated to point to new tab
            if (stat === 'cases') setActiveTab('support');
            if (stat === 'events') setActiveTab('events');
            if (stat === 'reports') setActiveTab('forms'); // Or wherever reports go
            if (stat === 'forms') setActiveTab('forms');
        },
        handleResetSystem: () => handleResetSystem(),
        setShowResetModal,
        handlePostAnnouncement: () => {
            setNewEvent({ title: '', description: '', event_date: new Date().toISOString().split('T')[0], type: 'Announcement' });
            setShowEventModal(true);
        },
        handleExport: () => {
            downloadCSV();
        },
        handleViewAllActivity: () => setActiveTab('audit'), // Or specific activity view
        handleQuickAction: (action: any) => {
            if (action === 'Schedule Wellness Check') setActiveTab('counseling');
            if (action === 'Send Announcement') functions.handlePostAnnouncement();
            if (action === 'View Reports') setActiveTab('analytics');
        }
    };

    const handleAppAction = async (id: any, status: any, notes: string = '') => {
        try {
            await supabase.from('applications').update({ status, notes }).eq('id', id);

            // Notify Student
            const app = applications.find(a => a.id === id);
            if (app) {
                await supabase.from('notifications').insert([{
                    student_id: app.student_id, // Assuming student_id maps nicely
                    message: `Your NAT Application status has been updated to: ${status}`
                }]);
            }

            showToastMessage(`Application ${status}`, 'success');
            setShowApplicationModal(false);
        } catch (err: any) {
            showToastMessage(err.message, 'error');
        }
    };

    const handleDeleteApplication = async (id: any) => {
        if (!window.confirm("Are you sure you want to PERMANENTLY delete this application? This action cannot be undone.")) return;

        try {
            const { error } = await supabase.from('applications').delete().eq('id', id);
            if (error) throw error;

            showToastMessage("Application deleted permanently.", 'success');
            setShowApplicationModal(false);
            // State update happens via realtime subscription or we can force it:
            setApplications(prev => prev.filter(app => app.id !== id));
        } catch (err: any) {
            showToastMessage("Failed to delete: " + err.message, 'error');
        }
    };

    const handleViewProfile = async (studentId: any) => {
        if (!studentId) {
            showToastMessage("No Student ID available for this request.", 'error');
            return;
        }

        // 1. Try to find in loaded list
        const student = students.find(s => s.student_id === studentId || s.id === studentId);
        if (student) {
            openEditModal(student);
        } else {
            // 2. Fetch if not found
            try {
                const { data, error } = await supabase.from('students').select('*').eq('student_id', studentId).single();
                if (error) throw error;
                if (data) openEditModal(data);
                else showToastMessage("Student profile not found.", 'info');
            } catch (err: any) {
                console.error("Profile fetch error:", err);
                showToastMessage("Could not load student profile.", 'error');
            }
        }
    };

    const handleScheduleSubmit = async (e: any) => {
        e.preventDefault();
        if (!selectedApp) return;

        try {
            console.log("CareStaffDashboard: Scheduling request...", selectedApp.id, scheduleData);
            // Use Staff_Scheduled for referred requests scheduled by care staff
            const newStatus = selectedApp.status === 'Referred' ? 'Staff_Scheduled' : 'Scheduled';
            const { error } = await supabase.from('counseling_requests').update({
                status: newStatus,
                scheduled_date: `${scheduleData.date} ${scheduleData.time}`,
                resolution_notes: scheduleData.notes
            }).eq('id', selectedApp.id);

            if (error) throw error;

            await supabase.from('notifications').insert([{
                student_id: selectedApp.student_id,
                message: `Your counseling session with CARE Staff is scheduled for ${scheduleData.date} at ${scheduleData.time}.`
            }]);

            showToastMessage('Session Scheduled Successfully');
            setShowScheduleModal(false);
            setScheduleData({ date: '', time: '', notes: '' });

            // Force refresh to update UI immediately
            console.log("CareStaffDashboard: Refreshing data after schedule...");
            await fetchData();
            await fetchCounseling();
        } catch (err: any) {
            console.error("CareStaffDashboard: Schedule error:", err);
            showToastMessage(err.message, 'error');
        }
    };

    const handleCompleteSession = async (e: any) => {
        e.preventDefault();
        try {
            await supabase.from('counseling_requests').update({
                status: 'Completed',
                resolution_notes: completionForm.publicNotes,
                confidential_notes: completionForm.privateNotes
            }).eq('id', completionForm.id);

            await supabase.from('notifications').insert([{
                student_id: completionForm.student_id,
                message: `Your counseling session has been marked as Completed. You can now view the advice.`
            }]);

            showToastMessage('Session marked as complete.');
            setShowCompleteModal(false);
            fetchData();
            fetchCounseling();
        } catch (err: any) { showToastMessage(err.message, 'error'); }
    };

    const handleForwardSupport = async () => {
        if (!supportForm.care_notes) { showToastMessage("Please add notes for Dept Head.", 'error'); return; }
        try {
            await supabase.from('support_requests').update({ status: 'Forwarded to Dept', care_notes: supportForm.care_notes }).eq('id', selectedSupportReq.id);
            showToastMessage("Request forwarded to Department Head.");
            setShowSupportModal(false);
            fetchData();
        } catch (err: any) { showToastMessage(err.message, 'error'); }
    };

    const handleFinalizeSupport = async () => {
        if (!supportForm.resolution_notes) { showToastMessage("Please add resolution notes.", 'error'); return; }
        try {
            await supabase.from('support_requests').update({ status: 'Completed', resolution_notes: supportForm.resolution_notes }).eq('id', selectedSupportReq.id);
            await supabase.from('notifications').insert([{ student_id: selectedSupportReq.student_id, message: `Your support request regarding ${selectedSupportReq.support_type} has been updated.` }]);
            showToastMessage("Request completed and student notified.");
            setShowSupportModal(false);
            fetchData();
        } catch (err: any) { showToastMessage(err.message, 'error'); }
    };

    // Download Counseling Referral Form as PDF (matches official NORSU form)
    const handleDownloadReferralForm = (req: any) => {
        const doc = new jsPDF();
        const pageW = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentW = pageW - margin * 2;

        // --- HEADER ---
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text('RA 9299', margin, 14);
        doc.text('Republic of the Philippines', pageW / 2, 10, { align: 'center' });
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('NEGROS ORIENTAL STATE UNIVERSITY', pageW / 2, 16, { align: 'center' });
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('NOPS (1907)    NOTS (1927)    EVSAT (1965)    CVPC (1983)', pageW / 2, 20, { align: 'center' });
        doc.text('Kagawasan Avenue, Dumaguete City, Negros Oriental, Philippines 6200', pageW / 2, 24, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Office of the Director, Counseling, Assessment, Resources, and Enhancement Center', pageW / 2, 32, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('COUNSELING REFERRAL FORM', pageW / 2, 42, { align: 'center' });
        doc.setFont('helvetica', 'normal');

        let y = 54;

        // --- FORM FIELDS (2-column with underlines) ---
        const drawField = (label: any, value: any, x: any, fieldW: any, yPos: any) => {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(label, x, yPos);
            const labelW = doc.getTextWidth(label) + 2;
            doc.setFont('helvetica', 'normal');
            doc.text(value || '', x + labelW, yPos);
            doc.setDrawColor(0, 0, 0);
            doc.line(x + labelW, yPos + 1, x + fieldW, yPos + 1);
        };

        drawField('Name of Student:', req.student_name || '', margin, contentW / 2 - 5, y);
        drawField('Course & Year:', req.course_year || '', pageW / 2 + 5, contentW / 2 - 5, y);
        y += 10;
        drawField('Schedule of Appointment:', req.scheduled_date ? new Date(req.scheduled_date).toLocaleString() : '', margin, contentW / 2 - 5, y);
        drawField('Contact Number:', req.referrer_contact_number || '', pageW / 2 + 5, contentW / 2 - 5, y);
        y += 10;
        drawField('Referred by:', req.referred_by || '', margin, contentW / 2 - 5, y);
        drawField('Contact Number:', req.contact_number || '', pageW / 2 + 5, contentW / 2 - 5, y);
        y += 10;
        drawField('Relationship with Student:', req.relationship_with_student || '', margin, contentW / 2 - 5, y);
        y += 14;

        // --- TEXT AREA SECTIONS ---
        const drawTextSection = (title: any, content: any, yStart: any, lineCount: any) => {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin, yStart);
            doc.setFont('helvetica', 'normal');
            yStart += 6;

            // Draw lined area
            doc.setDrawColor(180, 180, 180);
            for (let i = 0; i < lineCount; i++) {
                const lineY = yStart + (i * 8);
                doc.line(margin, lineY, pageW - margin, lineY);
            }

            // Write content on lines
            if (content) {
                doc.setFontSize(10);
                const splitText = doc.splitTextToSize(content, contentW);
                for (let i = 0; i < Math.min(splitText.length, lineCount); i++) {
                    doc.text(splitText[i], margin, yStart + (i * 8) - 1);
                }
            }

            return yStart + (lineCount * 8) + 4;
        };

        y = drawTextSection("Reason's for Referral: Briefly describe the reason/s for referral", req.reason_for_referral || req.description || '', y, 5);
        y = drawTextSection("Action's Made by the Referring Person:", req.actions_made || '', y, 4);
        y = drawTextSection("Date/ Duration of Observations:", req.date_duration_of_observations || '', y, 3);

        // --- SIGNATURE ---
        y += 10;
        // Embed the digital signature image if available
        if (req.referrer_signature) {
            try {
                doc.addImage(req.referrer_signature, 'PNG', pageW / 2 - 35, y - 5, 70, 30);
                y += 28;
            } catch (e) {
                console.error('Failed to embed signature:', e);
            }
        }
        doc.setDrawColor(0, 0, 0);
        doc.line(pageW / 2 - 45, y, pageW / 2 + 45, y);
        // Print the referrer name on the signature line (above the label)
        if (req.referred_by) {
            y -= 3;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(req.referred_by, pageW / 2, y, { align: 'center' });
            y += 8;
        } else {
            y += 5;
        }
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Name and Signature of the Referring Person', pageW / 2, y, { align: 'center' });

        // --- FOOTER ---
        const footerY = 275;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(margin, footerY, pageW - margin, footerY);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        doc.text(`Issue Date: ${new Date(req.created_at).toLocaleDateString()}`, margin, footerY + 5);
        doc.text(`Issue Status: ${req.status}`, pageW / 2, footerY + 5, { align: 'center' });
        doc.text('Page 1 of 1', pageW - margin, footerY + 5, { align: 'right' });
        doc.setFontSize(6);
        doc.text('Disclaimer: The information transmitted by this document is intended only for the person or entity to which it is addressed.', pageW / 2, footerY + 10, { align: 'center' });

        savePdf(doc, `Counseling_Referral_${(req.student_name || 'unknown').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
        showToastMessage('Referral form downloaded successfully!');
    };

    const handlePrintSupport = () => {
        const doc = new jsPDF({ format: 'legal' });
        const req = selectedSupportReq;
        const student = selectedStudent;
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();

        // Margins: Top 1" (25.4mm), Left 1.5" (38.1mm), Bottom 1" (25.4mm), Right 1" (25.4mm)
        const marginTop = 25.4;
        const marginLeft = 38.1;
        const marginBottom = 25.4;
        const marginRight = 25.4;

        const contentW = pageW - marginLeft - marginRight;

        // --- HEADER ---
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text('Kagawasan Avenue, Dumaguete City', marginLeft, marginTop);
        doc.text('Phone: (63) (35) 522-5050    Fax: 225-4751    Email: norsu@norsu.edu.ph', marginLeft, marginTop + 3);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('OFFICE OF THE CAMPUS STUDENT AFFAIRS AND SERVICES,', marginLeft + contentW / 2, marginTop + 10, { align: 'center' });
        doc.text('GUIHULNGAN CAMPUS', marginLeft + contentW / 2, marginTop + 15, { align: 'center' });

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('FORM FOR STUDENTS WHO REQUIRE ADDITIONAL SUPPORT', marginLeft + contentW / 2, marginTop + 24, { align: 'center' });
        doc.setFont('helvetica', 'normal');

        let y = marginTop + 32;

        // --- STUDENT INFO TABLE ---
        const drawFieldRow = (label: any, value: any, x: any, fieldW: any, yPos: any) => {
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(label, x, yPos);
            const labelW = doc.getTextWidth(label) + 2;
            doc.setFont('helvetica', 'normal');
            doc.text(String(value || ''), x + labelW, yPos);
            doc.setDrawColor(0, 0, 0);
            doc.line(x + labelW, yPos + 1, x + fieldW, yPos + 1);
        };

        const halfW = contentW / 2 - 4;
        const rightX = marginLeft + halfW + 8;

        drawFieldRow('Full Name:', req.student_name || '', marginLeft, halfW, y);
        drawFieldRow('Date Filed:', req.created_at ? new Date(req.created_at).toLocaleDateString() : '', rightX, halfW, y);
        y += 7;
        drawFieldRow('Date of Birth:', student?.dob || '', marginLeft, halfW, y);
        drawFieldRow('Program-Year Level:', `${student?.course || ''} ${student?.year_level ? '- ' + student.year_level : ''}`.trim(), rightX, halfW, y);
        y += 7;
        drawFieldRow('Cell Phone Number:', student?.mobile || '', marginLeft, halfW, y);
        y += 7;
        drawFieldRow('Email Address:', student?.email || '', marginLeft, halfW, y);
        y += 7;
        drawFieldRow('Home Address:', student?.address || '', marginLeft, contentW, y);
        y += 9;

        // --- CATEGORY SECTION ---
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Category (check all that apply):', marginLeft, y);
        y += 5;

        const allCategories = [
            'Persons with Disabilities (PWDs)',
            'Indigenous Peoples (IPs) & Cultural Communities',
            'Working Students',
            'Economically Challenged Students',
            'Students with Special Learning Needs',
            'Rebel Returnees',
            'Orphans',
            'Senior Citizens',
            'Homeless Students',
            'Solo Parenting',
            'Pregnant Women',
            'Women in Especially Difficult Circumstances',
        ];
        const selectedCats = (req.support_type || '').split(', ').map((c: any) => c.trim());

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        const catColW = contentW / 2;
        allCategories.forEach((cat: string, i: number) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const cx = marginLeft + col * catColW;
            const cy = y + row * 5;
            const isChecked = selectedCats.some((sc: any) => cat.toLowerCase().includes(sc.toLowerCase()) || sc.toLowerCase().includes(cat.toLowerCase()));

            // Draw checkbox
            doc.setDrawColor(0, 0, 0);
            if (isChecked) {
                doc.setFillColor(0, 0, 0); // Black fill
                doc.rect(cx, cy - 3, 3, 3, 'FD'); // Fill and Draw
                doc.setTextColor(255, 255, 255); // White text
                doc.setFont('helvetica', 'bold');
                doc.text('?', cx + 0.5, cy - 0.5);
                doc.setTextColor(0, 0, 0); // Reset text color
                doc.setFont('helvetica', 'normal');
            } else {
                doc.setFillColor(255, 255, 255);
                doc.rect(cx, cy - 3, 3, 3, 'FD');
            }
            doc.text(cat, cx + 5, cy);
        });

        // Handle "Other" categories
        const otherCats = selectedCats.filter((sc: any) => sc.startsWith('Other:'));
        const otherRow = Math.ceil(allCategories.length / 2);
        const otherY = y + otherRow * 5;

        doc.setDrawColor(0, 0, 0);
        if (otherCats.length > 0) {
            doc.setFillColor(0, 0, 0);
            doc.rect(marginLeft, otherY - 3, 3, 3, 'FD');
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.text('?', marginLeft + 0.5, otherY - 0.5);
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
        } else {
            doc.setFillColor(255, 255, 255);
            doc.rect(marginLeft, otherY - 3, 3, 3, 'FD');
        }
        doc.text(`Others, specify: ${otherCats.map((o: any) => o.replace('Other: ', '')).join(', ')}`, marginLeft + 5, otherY);

        y = otherY + 8;

        // --- SECTION A: YOUR STUDIES ---
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.4);
        doc.line(marginLeft, y, marginLeft + contentW, y);
        y += 5;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('A. Your studies', marginLeft, y);
        y += 4;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Which program(s) did you apply for?', marginLeft, y);
        y += 6;

        const drawPriorityRow = (label: any, value: any, yPos: any) => {
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(label, marginLeft, yPos);
            const labelW = doc.getTextWidth(label) + 2;
            doc.setFont('helvetica', 'normal');
            doc.text(String(value || 'N/A'), marginLeft + labelW, yPos);
            doc.setDrawColor(0, 0, 0);
            doc.line(marginLeft + labelW, yPos + 1, marginLeft + contentW, yPos + 1);
        };

        drawPriorityRow('1st Priority:', student?.priority_course || 'N/A', y);
        y += 6;
        drawPriorityRow('2nd Priority:', student?.alt_course_1 || 'N/A', y);
        y += 6;
        drawPriorityRow('3rd Priority:', student?.alt_course_2 || 'N/A', y);
        y += 8;

        // --- SECTION B: PARTICULARS ---
        doc.setLineWidth(0.4);
        doc.line(marginLeft, y, marginLeft + contentW, y);
        y += 5;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('B. Particulars of your disability or special learning need', marginLeft, y);
        y += 4;
        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        const disclaimerText = 'We would like to gain a better understanding of the kind of support that you may need. However, we might not be able to assist in all the ways that you require, but it might help us with our planning in future.';
        const splitDisclaimer = doc.splitTextToSize(disclaimerText, contentW);
        doc.text(splitDisclaimer, marginLeft, y);
        y += splitDisclaimer.length * 3.5 + 3;

        // Parse Q1-Q4 from description
        const desc = req.description || '';
        const getPart = (key: any, nextKey: any) => {
            const start = desc.indexOf(key);
            if (start === -1) return '';
            let end = nextKey ? desc.indexOf(nextKey) : -1;
            if (end === -1) end = desc.length;
            return desc.substring(start + key.length, end).trim();
        };
        const q1 = getPart('[Q1 Description]:', '[Q2 Previous Support]:');
        const q2 = getPart('[Q2 Previous Support]:', '[Q3 Required Support]:');
        const q3 = getPart('[Q3 Required Support]:', '[Q4 Other Needs]:');
        const q4 = getPart('[Q4 Other Needs]:', null);

        const drawQuestion = (num: any, question: any, answer: any) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            const qLines = doc.splitTextToSize(`${num}. ${question}`, contentW);
            doc.text(qLines, marginLeft, y);
            y += qLines.length * 3.5 + 2;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            if (answer) {
                const aLines = doc.splitTextToSize(answer, contentW);
                // Draw lined area for answers
                doc.setDrawColor(180, 180, 180);
                const lineCount = Math.max(aLines.length, 2);
                for (let i = 0; i < lineCount; i++) {
                    doc.line(marginLeft, y + (i * 5.5), marginLeft + contentW, y + (i * 5.5));
                }
                // Write content
                for (let i = 0; i < aLines.length; i++) {
                    doc.text(aLines[i], marginLeft, y + (i * 5.5) - 1);
                }
                y += lineCount * 5.5 + 3;
            } else {
                doc.setDrawColor(180, 180, 180);
                for (let i = 0; i < 2; i++) {
                    doc.line(marginLeft, y + (i * 5.5), marginLeft + contentW, y + (i * 5.5));
                }
                y += 14;
            }
        };

        drawQuestion(1, 'Upon application, you indicated that you have a disability or special learning need. Please describe it briefly.', q1);
        drawQuestion(2, 'What kind of support did you receive at your previous school?', q2);
        drawQuestion(3, 'What support or assistance do you require from NORSU-Guihulngan Campus to enable you to fully participate in campus activities, move safely and independently within the campus, and engage effectively in classroom and other learning environments, including lectures, practical sessions, tests, examinations, and other forms of assessment?', q3);
        drawQuestion(4, 'Indicate and elaborate on any other special needs or assistance that may be required:', q4);

        // --- FOOTER ---
        const totalPages = (doc as any).getNumberOfPages ? (doc as any).getNumberOfPages() : 0;
        for (let p = 1; p <= totalPages; p++) {
            doc.setPage(p);
            const footerY = pageH - marginBottom;
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.3);
            doc.line(marginLeft, footerY, marginLeft + contentW, footerY);
            doc.setFontSize(6);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(`Date Filed: ${new Date(req.created_at).toLocaleDateString()}`, marginLeft, footerY + 4);
            doc.text(`Status: ${req.status}`, marginLeft + contentW / 2, footerY + 4, { align: 'center' });
            doc.text(`Page ${p} of ${totalPages}`, marginLeft + contentW, footerY + 4, { align: 'right' });
            doc.setFontSize(5);
            doc.text('Disclaimer: The information transmitted by this document is intended only for the person or entity to which it is addressed.', marginLeft + contentW / 2, footerY + 8, { align: 'center' });
        }

        savePdf(doc, `Additional_Support_${(req.student_name || 'unknown').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
        showToastMessage('Support form downloaded successfully!');
    };

    const openSupportModal = async (req: any) => {
        setSelectedSupportReq(req);
        setSupportForm({ care_notes: req.care_notes || '', resolution_notes: req.resolution_notes || '' });
        setSelectedStudent(null);
        // Fetch student profile
        if (req.student_id) {
            const { data } = await supabase.from('students').select('*').eq('student_id', req.student_id).maybeSingle();
            setSelectedStudent(data);
        }
        setShowSupportModal(true);
    };

    const renderDetailedDescription = (desc: any) => {
        if (!desc) return <p className="text-sm text-gray-500 italic">No description provided.</p>;
        const q1Index = desc.indexOf('[Q1 Description]:');
        if (q1Index === -1) return <p className="text-sm text-gray-800 whitespace-pre-wrap">{desc}</p>;

        const getPart = (key: string, nextKey: string | null) => {
            const start = desc.indexOf(key);
            if (start === -1) return null;
            let end = nextKey ? desc.indexOf(nextKey) : -1;
            if (end === -1) end = desc.length;
            return desc.substring(start + key.length, end).trim();
        };

        const q1 = getPart('[Q1 Description]:', '[Q2 Previous Support]:');
        const q2 = getPart('[Q2 Previous Support]:', '[Q3 Required Support]:');
        const q3 = getPart('[Q3 Required Support]:', '[Q4 Other Needs]:');
        const q4 = getPart('[Q4 Other Needs]:', null);

        return (
            <div className="space-y-4 mt-3">
                {q1 && <div><p className="text-xs font-bold text-gray-600 mb-1">1. Upon application, you indicated that you have a disability or special learning need. Please describe it briefly.</p><p className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-100 whitespace-pre-wrap">{q1}</p></div>}
                {q2 && <div><p className="text-xs font-bold text-gray-600 mb-1">2. What kind of support did you receive at your previous school?</p><p className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-100 whitespace-pre-wrap">{q2}</p></div>}
                {q3 && <div><p className="text-xs font-bold text-gray-600 mb-1">3. What support or assistance do you require from NORSU to fully participate in campus activities?</p><p className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-100 whitespace-pre-wrap">{q3}</p></div>}
                {q4 && <div><label className="block text-xs font-bold text-gray-700 mb-1">4. Indicate and elaborate on any other special needs or assistance that may be required:</label><textarea rows={2} readOnly value={q4 || ''} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700"></textarea></div>}
            </div>
        );
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            showToastMessage("Geolocation is not supported.", 'error');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setNewEvent((prev: any) => ({ ...prev, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
                showToastMessage("Location retrieved!");
            },
            (err) => showToastMessage("Unable to retrieve location: " + err.message, 'error')
        );
    };

    const handleViewAttendees = async (event: any) => {
        setSelectedEventTitle(event.title);
        try {
            const { data, error } = await supabase.from('event_attendance').select('*').eq('event_id', event.id).order('time_in', { ascending: false });
            if (error) throw error;
            // Enrich with year_level, section, course, department from students table
            let enriched = data || [];
            if (enriched.length > 0) {
                const studentIds = [...new Set(enriched.map((a: any) => a.student_id).filter(Boolean))];
                if (studentIds.length > 0) {
                    const { data: studs } = await supabase.from('students').select('student_id, year_level, section, course, department').in('student_id', studentIds);
                    const stuMap: any = {};
                    (studs || []).forEach((s: any) => { stuMap[s.student_id] = s; });
                    enriched = enriched.map((a: any) => ({
                        ...a,
                        year_level: stuMap[a.student_id]?.year_level || '',
                        section: stuMap[a.student_id]?.section || '',
                        course: a.course || stuMap[a.student_id]?.course || '',
                        department: stuMap[a.student_id]?.department || ''
                    }));
                }
            }
            setAttendees(enriched);
            setShowAttendeesModal(true);
            setYearLevelFilter('All');
            setAttendeeCourseFilter('All');
            setAttendeeSectionFilter('All');
        } catch (err: any) { showToastMessage(err.message, 'error'); }
    };

    const handleViewFeedback = async (event: any) => {
        setSelectedEventTitle(event.title);
        try {
            const { data, error } = await supabase.from('event_feedback').select('*').eq('event_id', event.id).order('submitted_at', { ascending: false });
            if (error) throw error;
            setFeedbackList(data || []);
            setShowFeedbackModal(true);
        } catch (err: any) { showToastMessage(err.message, 'error'); }
    };

    const processSupportRequest = async (req: any, action: any) => {
        try {
            let newStatus = action === 'Approved' ? 'Forwarded to Dept' : 'Rejected';
            // If already forwarded, maybe we are completing it?
            // "Forwarded to Dept" -> Dept Heads see it.
            // If we want to "Complete" it after Dept approves?
            // For now, let's assume Care Staff forwards to Dept.

            await supabase.from('support_requests').update({ status: newStatus }).eq('id', req.id);
            showToastMessage(`Request ${newStatus}`);
        } catch (err: any) { showToastMessage(err.message, 'error'); }
    };

    const createEvent = async (e: any) => {
        e.preventDefault();
        try {
            const payload = {
                title: newEvent.title,
                type: newEvent.type,
                description: newEvent.description,
                location: newEvent.type === 'Event' ? newEvent.location : 'Online/General',
                event_date: newEvent.event_date,
                event_time: newEvent.type === 'Event' ? (newEvent.event_time || null) : null,
                end_time: newEvent.type === 'Event' ? (newEvent.end_time || null) : null,
                latitude: newEvent.latitude || null,
                longitude: newEvent.longitude || null
            };

            if (editingEventId) {
                await supabase.from('events').update(payload).eq('id', editingEventId);
                showToastMessage('Item updated successfully!');
            } else {
                await supabase.from('events').insert([payload]);
                showToastMessage('Item created successfully!');
            }
            setShowEventModal(false);
            setEditingEventId(null);
            setNewEvent({ title: '', description: '', event_date: '', event_time: '', end_time: '', location: '', latitude: '', longitude: '', type: 'Event' });
            fetchData();
        } catch (err: any) { showToastMessage(err.message, 'error'); }
    };

    const handleEditEvent = (item: any) => {
        setNewEvent({
            title: item.title,
            type: item.type,
            description: item.description,
            location: item.location || '',
            event_date: item.event_date || '',
            event_time: item.event_time || '',
            end_time: item.end_time || '',
            latitude: item.latitude || '',
            longitude: item.longitude || ''
        });
        setEditingEventId(item.id);
        setShowEventModal(true);
    };

    const handleDeleteEvent = async (id: any) => {
        setEventToDelete(id);
        setShowDeleteEventModal(true);
    };

    const confirmDeleteEvent = async () => {
        if (!eventToDelete) return;
        try {
            await supabase.from('events').delete().eq('id', eventToDelete);
            showToastMessage('Item deleted.');
            setShowDeleteEventModal(false);
            setEventToDelete(null);
            fetchData();
        } catch (err: any) {
            showToastMessage(err.message, 'error');
            setShowDeleteEventModal(false);
            setEventToDelete(null);
        }
    };

    const openEditModal = (student: any) => {
        setEditForm({ ...student });
        setShowEditModal(true);
    };

    const handleUpdateStudent = async (e: any) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('students')
                .update({
                    first_name: editForm.first_name,
                    last_name: editForm.last_name,
                    middle_name: editForm.middle_name,
                    suffix: editForm.suffix,
                    dob: editForm.dob,
                    place_of_birth: editForm.place_of_birth,
                    sex: editForm.sex,
                    gender_identity: editForm.gender_identity,
                    civil_status: editForm.civil_status,
                    nationality: editForm.nationality,
                    street: editForm.street,
                    city: editForm.city,
                    province: editForm.province,
                    zip_code: editForm.zip_code,
                    mobile: editForm.mobile,
                    email: editForm.email,
                    facebook_url: editForm.facebook_url,
                    course: editForm.course,
                    year_level: editForm.year_level,
                    status: editForm.status
                })
                .eq('id', editForm.id);

            if (error) throw error;
            showToastMessage("Student updated successfully!");
            setShowEditModal(false);
            fetchData();
        } catch (error: any) {
            showToastMessage("Error updating student: " + error.message, 'error');
        }
    };

    const confirmDeleteStudent = async () => {
        if (!studentToDelete) return;
        try {
            // 1. Delete associated enrollment key
            const { error: keyError } = await supabase.from('enrolled_students').delete().eq('student_id', studentToDelete.student_id);
            if (keyError) console.warn("Could not delete enrollment key, or none existed:", keyError.message);

            // 2. Delete student profile
            const { error } = await supabase.from('students').delete().eq('id', studentToDelete.id);
            if (error) throw error;

            showToastMessage("Student and enrollment key deleted successfully.");
            setShowDeleteModal(false);
            setStudentToDelete(null);
            fetchData();
        } catch (error: any) {
            showToastMessage("Error deleting student: " + error.message, 'error');
        }
    };

    const downloadCSV = () => {
        // Simple CSV Export for Applications
        const headers = ["ID", "Name", "Email", "Course", "Status"];
        const rows = applications.map(a => [a.id, `${a.first_name} ${a.last_name}`, a.email, a.priority_course, a.status]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "applications_export.csv");
        document.body.appendChild(link);
        link.click();
    };

    // Scholarship Handlers
    const handleAddScholarship = async () => {
        if (!scholarshipForm.title || !scholarshipForm.deadline) {
            showToastMessage("Title and Deadline are required.", "error"); return;
        }
        setLoading(true);
        try {
            const { error } = await supabase.from('scholarships').insert([{
                ...scholarshipForm
            }]);
            if (error) throw error;
            showToastMessage("Scholarship added successfully!");
            setShowScholarshipModal(false);
            setScholarshipForm({ title: '', description: '', requirements: '', deadline: '' });
            fetchData();
        } catch (err: any) {
            showToastMessage(err.message, "error");
        } finally { setLoading(false); }
    };

    const handleViewApplicants = async (scholarship: any) => {
        setSelectedScholarship(scholarship);
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('scholarship_applications')
                .select('*')
                .eq('scholarship_id', scholarship.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplicantsList(data || []);
            setShowApplicantModal(true);
        } catch (err: any) {
            showToastMessage("Failed to fetch applicants: " + err.message, "error");
        } finally { setLoading(false); }
    };

    const handleExportApplicants = () => {
        if (!applicantsList.length) { showToastMessage("No applicants to export.", "error"); return; }
        const headers = ["Student Name", "Course", "Year", "Contact", "Email", "Date Applied"];
        const rows = applicantsList.map(a => [
            a.student_name,
            a.course,
            a.year_level,
            a.contact_number,
            a.email,
            new Date(a.created_at).toLocaleDateString()
        ]);
        exportToExcel(headers, rows, `${selectedScholarship.title}_Applicants`);
    };

    const handleDeleteScholarship = async (id: any) => {
        if (!window.confirm("Are you sure you want to delete this scholarship?")) return;
        try {
            const { error } = await supabase.from('scholarships').delete().eq('id', id);
            if (error) throw error;
            showToastMessage("Scholarship deleted.");
            fetchData();
        } catch (err: any) { showToastMessage(err.message, "error"); }
    };

    // System Reset (matches HTML handleResetSystem exactly — wipes 14+ tables)
    const handleResetSystem = async () => {
        setShowResetModal(false);
        try {
            const standardTables = [
                'answers', 'submissions', 'notifications', 'office_visits', 'support_requests',
                'counseling_requests', 'event_feedback', 'general_feedback', 'event_attendance', 'applications',
                'scholarships', 'events', 'audit_logs', 'needs_assessments', 'students'
            ];
            for (const table of standardTables) {
                await supabase.from(table).delete().neq('id', 0);
            }
            // Delete from tables with specific PKs
            await supabase.from('enrolled_students').delete().neq('student_id', '0');

            showToastMessage('System data has been successfully reset.');
            window.location.reload();
        } catch (err: any) {
            console.error('Reset error:', err);
            showToastMessage('Reset completed with some warnings. Check console.', 'error');
        }
    };

    // Chart Data
    const appStatusData = {
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [{
            data: [stats.pending, stats.approved, applications.filter(a => a.status === 'Rejected').length],
            backgroundColor: ['#FBBF24', '#34D399', '#F87171'],
            borderWidth: 0
        }]
    };


    const sharedState = {
        studentsList: students,
        allCourses: allCourses,
        allDepartments: allDepartments,
        fetchStudents: fetchData,
        showEditModal, setShowEditModal,
        editForm, setEditForm,
        showDeleteModal, setShowDeleteModal,
        studentToDelete, setStudentToDelete,
        openEditModal,
        handleUpdateStudent,
        confirmDeleteStudent
    };

    return {
        activeTab,
        allCourses,
        allDepartments,
        applicantsList,
        applications,
        appStatusData,
        attendeeCourseFilter,
        attendeeFilter,
        attendees,
        attendeeSectionFilter,
        commandHubTab,
        completionForm,
        confirmDeleteEvent,
        confirmDeleteStudent,
        counselingReqs,
        counselingTab,
        createEvent,
        downloadCSV,
        editForm,
        editingEventId,
        eventFilter,
        events,
        eventToDelete,
        feedbackList,
        fetchCounseling,
        fetchData,
        formModalView,
        functions,
        getCurrentLocation,
        handleAddScholarship,
        handleAppAction,
        handleCompleteSession,
        handleDeleteApplication,
        handleDeleteEvent,
        handleDeleteScholarship,
        handleDownloadReferralForm,
        handleEditEvent,
        handleExportApplicants,
        handleFinalizeSupport,
        handleForwardSupport,
        handlePrintSupport,
        handleResetSystem,
        handleScheduleSubmit,
        handleUpdateStudent,
        handleViewApplicants,
        handleViewAttendees,
        handleViewFeedback,
        handleViewProfile,
        isAuthenticated,
        isRefreshing,
        loading,
        logAudit,
        logout,
        navigate,
        newEvent,
        notifications,
        openEditModal,
        openSupportModal,
        processSupportRequest,
        refreshAll,
        renderDetailedDescription,
        scheduleData,
        scholarshipForm,
        scholarships,
        searchTerm,
        selectedApp,
        selectedEventTitle,
        selectedScholarship,
        selectedStudent,
        selectedSupportReq,
        session,
        setActiveTab,
        setAllCourses,
        setAllDepartments,
        setApplicantsList,
        setApplications,
        setAttendeeCourseFilter,
        setAttendeeFilter,
        setAttendees,
        setAttendeeSectionFilter,
        setCommandHubTab,
        setCompletionForm,
        setCounselingReqs,
        setCounselingTab,
        setEditForm,
        setEditingEventId,
        setEventFilter,
        setEvents,
        setEventToDelete,
        setFeedbackList,
        setFormModalView,
        setIsRefreshing,
        setLoading,
        setNewEvent,
        setNotifications,
        setScheduleData,
        setScholarshipForm,
        setScholarships,
        setSearchTerm,
        setSelectedApp,
        setSelectedEventTitle,
        setSelectedScholarship,
        setSelectedStudent,
        setSelectedSupportReq,
        setShowApplicantModal,
        setShowApplicationModal,
        setShowAttendeesModal,
        setShowCommandHub,
        setShowCompleteModal,
        setShowCounselingFormModal,
        setShowDeleteEventModal,
        setShowDeleteModal,
        setShowEditModal,
        setShowEventModal,
        setShowFeedbackModal,
        setShowResetModal,
        setShowScheduleModal,
        setShowScholarshipModal,
        setShowSupportModal,
        setSidebarOpen,
        setStaffNotes,
        setStatusFilter,
        setStudents,
        setStudentToDelete,
        setSupportCategory,
        setSupportForm,
        setSupportReqs,
        setSupportTab,
        setToast,
        setViewFormReq,
        setYearLevelFilter,
        sharedState,
        showApplicantModal,
        showApplicationModal,
        showAttendeesModal,
        showCommandHub,
        showCompleteModal,
        showCounselingFormModal,
        showDeleteEventModal,
        showDeleteModal,
        showEditModal,
        showEventModal,
        showFeedbackModal,
        showResetModal,
        showScheduleModal,
        showScholarshipModal,
        showSupportModal,
        showToastMessage,
        sidebarOpen,
        staffNotes,
        stats,
        statusFilter,
        students,
        studentToDelete,
        supportCategory,
        supportForm,
        supportReqs,
        supportTab,
        toast,
        viewFormReq,
        yearLevelFilter
    };
};

export default useCareStaffDashboardController;


