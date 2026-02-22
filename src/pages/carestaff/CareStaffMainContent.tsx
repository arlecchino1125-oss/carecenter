import React from 'react';
import AuditLogsPage from './AuditLogsPage';
import OfficeLogbookPage from './OfficeLogbookPage';
import FormManagementPage from './FormManagementPage';
import FeedbackPage from './FeedbackPage';
import NATManagementPage from './NATManagementPage';
import StudentPopulationPage from './StudentPopulationPage';
import StudentAnalyticsPage from './StudentAnalyticsPage';
import HomePage from './HomePage';
import CounselingPage from './CounselingPage';
import SupportRequestsPage from './SupportRequestsPage';
import EventsPage from './EventsPage';
import CareStaffDashboardModule from './modules/CareStaffDashboardModule';
import CareStaffApplicationsModule from './modules/CareStaffApplicationsModule';
import CareStaffScholarshipModule from './modules/CareStaffScholarshipModule';

const CareStaffMainContent = ({ p }: { p: any }) => {
    const {
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
    } = p;

    return (
                <div key={activeTab} className="flex-1 overflow-y-auto p-6 lg:p-10 page-transition">
                    {activeTab === 'home' && <HomePage functions={functions} />}
                    {activeTab === 'population' && <StudentPopulationPage functions={functions} sharedState={sharedState} />}
                    {activeTab === 'dashboard' && <CareStaffDashboardModule p={{ students, stats, events, counselingReqs, supportReqs, applications, setEditingEventId, setNewEvent, setShowEventModal, setActiveTab }} />}

                    {activeTab === 'analytics' && <StudentAnalyticsPage functions={functions} />}
                    {activeTab === 'nat' && <NATManagementPage showToast={showToastMessage} />}


                    {activeTab === 'applications' && <CareStaffApplicationsModule p={{ applications, searchTerm, setSearchTerm, downloadCSV, setSelectedApp, setShowApplicationModal }} />}

                    {activeTab === 'counseling' && <CounselingPage
                        counselingReqs={counselingReqs} counselingTab={counselingTab} setCounselingTab={setCounselingTab}
                        loading={loading} handleViewProfile={handleViewProfile} handleDownloadReferralForm={handleDownloadReferralForm}
                        setSelectedApp={setSelectedApp} setShowScheduleModal={setShowScheduleModal}
                        setCompletionForm={setCompletionForm} completionForm={completionForm} setShowCompleteModal={setShowCompleteModal}
                        viewFormReq={viewFormReq} setViewFormReq={setViewFormReq}
                        showCounselingFormModal={showCounselingFormModal} setShowCounselingFormModal={setShowCounselingFormModal}
                        formModalView={formModalView} setFormModalView={setFormModalView}
                    />}

                    {activeTab === 'support' && <SupportRequestsPage
                        supportReqs={supportReqs} supportTab={supportTab} setSupportTab={setSupportTab}
                        supportCategory={supportCategory} setSupportCategory={setSupportCategory}
                        openSupportModal={openSupportModal}
                    />}

                    {activeTab === 'events' && <EventsPage
                        events={events} eventFilter={eventFilter} setEventFilter={setEventFilter}
                        setEditingEventId={setEditingEventId} setNewEvent={setNewEvent} setShowEventModal={setShowEventModal}
                        handleViewFeedback={handleViewFeedback} handleViewAttendees={handleViewAttendees}
                        handleEditEvent={handleEditEvent} handleDeleteEvent={handleDeleteEvent}
                    />}
                    {activeTab === 'forms' && <FormManagementPage functions={functions} />}
                    {activeTab === 'feedback' && <FeedbackPage functions={functions} />}
                    {activeTab === 'audit' && <AuditLogsPage />}
                    {activeTab === 'logbook' && <OfficeLogbookPage functions={functions} />}

                    {activeTab === 'scholarship' && <CareStaffScholarshipModule p={{ scholarships, setShowScholarshipModal, handleViewApplicants, handleDeleteScholarship }} />}

                </div>
    );
};

export default CareStaffMainContent;

