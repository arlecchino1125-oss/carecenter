import React from 'react';
import StudentPortalSidebar from './student/StudentPortalSidebar';
import StudentDashboardModule from './student/modules/StudentDashboardModule';
import StudentEventsModule from './student/modules/StudentEventsModule';
import StudentAssessmentModule from './student/modules/StudentAssessmentModule';
import StudentCounselingModule from './student/modules/StudentCounselingModule';
import StudentSupportModule from './student/modules/StudentSupportModule';
import StudentScholarshipModule from './student/modules/StudentScholarshipModule';
import StudentFeedbackModule from './student/modules/StudentFeedbackModule';
import StudentProfileModule from './student/modules/StudentProfileModule';
import { StudentTourOverlay, StudentInContentOverlays, StudentFloatingHub } from './student/overlays/StudentPortalOverlays';
import StudentProfileCompletionModal from './student/overlays/StudentProfileCompletionModal';
import useStudentPortalController from './student/useStudentPortalController';

export default function StudentPortal() {
    const { loading, p, viewLabels } = useStudentPortalController() as any;

    if (loading) {
        return <div className="student-portal-root min-h-screen flex items-center justify-center text-slate-500">Loading Student Portal...</div>;
    }

    const {
        isSidebarOpen,
        setIsSidebarOpen,
        sidebarLinks,
        activeView,
        setActiveView,
        setIsEditing,
        Icons,
        notifications
    } = p;

    return (
        <div className="student-portal-root flex h-screen text-gray-800 overflow-hidden relative">

            {/* Onboarding Tour Overlay */}
            <StudentTourOverlay p={p} />

            <StudentProfileCompletionModal p={p} />

            {/* Mobile Overlay */}
            {isSidebarOpen && <div className="fixed inset-0 bg-slate-950/45 z-20 lg:hidden animate-backdrop" onClick={() => setIsSidebarOpen(false)} />}

            {/* Premium Sidebar */}
            <StudentPortalSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} sidebarLinks={sidebarLinks} activeView={activeView} setActiveView={setActiveView} setIsEditing={setIsEditing} Icons={Icons} />
            {/* Main Content */}
            <main className="student-main-shell flex-1 flex flex-col h-full overflow-hidden">
                {/* Premium Header */}
                <header className="student-main-header h-16 glass gradient-border-blue relative flex items-center justify-between px-6 lg:px-10 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg></button>
                        <h2 className="text-xl font-bold gradient-text-blue">{(viewLabels as any)[activeView] || activeView}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="student-action-chip w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:shadow-md transition-all relative border border-gray-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                            {notifications.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse-glow" />}
                        </button>
                    </div>
                </header>

                <div key={activeView} className="student-content-stage flex-1 overflow-y-auto p-6 lg:p-10 page-transition">


                    {/* DASHBOARD + EVENTS + SIDEBAR VIEW MODULES */}
                    <StudentDashboardModule p={p} />
                    <StudentEventsModule p={p} />
                    <StudentAssessmentModule p={p} />
                    <StudentCounselingModule p={p} />
                    <StudentSupportModule p={p} />
                    <StudentScholarshipModule p={p} />
                    <StudentFeedbackModule p={p} />
                    <StudentProfileModule p={p} />
                    <StudentInContentOverlays p={p} />
                </div>
            </main>
            <StudentFloatingHub p={p} />
        </div>
    );
}
