import CalendarView from '../../components/CalendarView';
import {
    Users, FileText, Clock, CheckCircle, Calendar,
    User, Eye, Send, Download
} from 'lucide-react';



const CounselingPage = ({
    counselingReqs, counselingTab, setCounselingTab,
    loading, handleViewProfile, handleDownloadReferralForm,
    setSelectedApp, setShowScheduleModal,
    setCompletionForm, completionForm, setShowCompleteModal,
    viewFormReq, setViewFormReq,
    showCounselingFormModal, setShowCounselingFormModal,
    formModalView, setFormModalView
}: any) => {
    return (
        <>
            <div>
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Counseling Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Review applications, manage referrals, and schedule sessions</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
                    {[
                        { label: 'Total Requests', value: counselingReqs.length, icon: <FileText size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Awaiting Dept', value: counselingReqs.filter(r => r.status === 'Submitted').length, icon: <Clock size={20} />, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                        { label: 'Referred', value: counselingReqs.filter(r => r.status === 'Referred').length, icon: <Send size={20} />, color: 'text-purple-500', bg: 'bg-purple-50' },
                        { label: 'Scheduled', value: counselingReqs.filter(r => r.status === 'Scheduled').length, icon: <Calendar size={20} />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                        { label: 'Completed', value: counselingReqs.filter(r => r.status === 'Completed').length, icon: <CheckCircle size={20} />, color: 'text-green-500', bg: 'bg-green-50' },
                    ].map((stat, idx) => (
                        <div key={idx} className="card-hover bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-100/80 shadow-sm animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3 ${stat.color} shadow-sm`}>{stat.icon}</div>
                            <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tab Bar */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                    {[
                        { id: 'Referred', label: `Forwarded (${counselingReqs.filter(r => r.status === 'Referred').length})` },
                        { id: 'Staff_Scheduled', label: `Staff Scheduled (${counselingReqs.filter(r => r.status === 'Staff_Scheduled').length})` },
                        { id: 'Submitted', label: `Awaiting Dept (${counselingReqs.filter(r => r.status === 'Submitted').length})` },
                        { id: 'Scheduled', label: `Dept Scheduled (${counselingReqs.filter(r => r.status === 'Scheduled').length})` },
                        { id: 'Completed', label: `Completed (${counselingReqs.filter(r => r.status === 'Completed').length})` },
                        { id: 'Calendar', label: 'Calendar View' },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setCounselingTab(tab.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${counselingTab === tab.id ? 'bg-white text-purple-700 shadow-md shadow-purple-100 border border-purple-200' : 'bg-gray-100 text-gray-600 hover:text-purple-600 hover:bg-white/80 border border-transparent'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {counselingTab === 'Calendar' ? (
                    <CalendarView requests={counselingReqs} />
                ) : loading ? (
                    <div className="text-center py-8 text-gray-500">Loading requests...</div>
                ) : counselingTab === 'Completed' ? (
                    <div className="space-y-4 animate-fade-in">
                        {counselingReqs.filter(r => r.status === 'Completed').length === 0 ? (
                            <div className="text-center py-8 text-gray-400">No completed requests found.</div>
                        ) : (
                            counselingReqs.filter(r => r.status === 'Completed').map(req => (
                                <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100 text-green-600">
                                                <CheckCircle size={18} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{req.student_name}</h3>
                                                <p className="text-xs text-gray-500">{req.request_type} • Resolved: {new Date(req.updated_at || req.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleViewProfile(req.student_id)} className="px-3 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition flex items-center gap-1">
                                                <User size={12} /> Profile
                                            </button>
                                            <button onClick={() => { setViewFormReq(req); setShowCounselingFormModal(true); }} className="px-3 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition flex items-center gap-1">
                                                <Eye size={12} /> View Form
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : counselingReqs.filter(r => r.status === counselingTab).length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No requests in this category.</div>
                ) : (
                    <div className="space-y-4">
                        {counselingReqs.filter(r => r.status === counselingTab).map(req => (
                            <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${req.status === 'Referred' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            <Users size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{req.student_name}</h3>
                                            <p className="text-xs text-gray-500">{req.request_type} • {new Date(req.created_at).toLocaleDateString()}{req.scheduled_date ? ` • Scheduled: ${new Date(req.scheduled_date).toLocaleDateString()}` : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleViewProfile(req.student_id)} className="px-3 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition flex items-center gap-1">
                                            <User size={12} /> Profile
                                        </button>
                                        <button onClick={() => { setViewFormReq(req); setShowCounselingFormModal(true); }} className="px-3 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition flex items-center gap-1">
                                            <Eye size={12} /> View Form
                                        </button>
                                        {(req.status === 'Referred' || req.status === 'Pending') && (
                                            <button onClick={() => { setSelectedApp(req); setShowScheduleModal(true); }} className="px-3 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition flex items-center gap-1">
                                                <Calendar size={12} /> Schedule
                                            </button>
                                        )}
                                        {(req.status === 'Scheduled' || req.status === 'Staff_Scheduled') && (
                                            <button onClick={() => { setCompletionForm({ ...completionForm, id: req.id, student_id: req.student_id }); setShowCompleteModal(true); }} className="px-3 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition flex items-center gap-1">
                                                <CheckCircle size={12} /> Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Read-only Form Modal — Referral-first or Student Form */}
            {showCounselingFormModal && viewFormReq && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-100/50 animate-fade-in-up">
                        <div className="p-8">
                            {/* Show Referral Form view */}
                            {viewFormReq.referred_by && formModalView === 'referral' ? (
                                <>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="font-extrabold text-lg">DEPARTMENT HEAD REFERRAL FORM</h3>
                                            <p className="text-xs text-gray-400 mt-1">Referral submitted for counseling intervention</p>
                                            <p className="text-[10px] text-gray-400 mt-1">Submitted: {new Date(viewFormReq.created_at).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${viewFormReq.status === 'Referred' ? 'bg-purple-100 text-purple-700' : viewFormReq.status === 'Staff_Scheduled' ? 'bg-indigo-100 text-indigo-700' : viewFormReq.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : viewFormReq.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{viewFormReq.status === 'Referred' ? 'Forwarded' : viewFormReq.status === 'Staff_Scheduled' ? 'Staff Scheduled' : viewFormReq.status}</span>
                                            <button onClick={() => { setShowCounselingFormModal(false); setFormModalView('referral'); }} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                                        </div>
                                    </div>
                                    {/* Student info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Name of Student</label><input readOnly value={viewFormReq.student_name || ''} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 cursor-not-allowed" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Course & Year</label><input readOnly value={viewFormReq.course_year || ''} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 cursor-not-allowed" /></div>
                                    </div>
                                    {/* Referral details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Referred by</label><input readOnly value={viewFormReq.referred_by || ''} className="w-full bg-purple-50 border border-purple-200 rounded-xl p-3 text-sm text-gray-700 cursor-not-allowed" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Referrer Contact Number</label><input readOnly value={viewFormReq.referrer_contact_number || 'N/A'} className="w-full bg-purple-50 border border-purple-200 rounded-xl p-3 text-sm text-gray-700 cursor-not-allowed" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Relationship with Student</label><input readOnly value={viewFormReq.relationship_with_student || 'N/A'} className="w-full bg-purple-50 border border-purple-200 rounded-xl p-3 text-sm text-gray-700 cursor-not-allowed" /></div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Reason/s for Referral</label>
                                        <textarea readOnly rows={4} value={viewFormReq.reason_for_referral || viewFormReq.description || ''} className="w-full bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-gray-700 cursor-not-allowed resize-none"></textarea>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Actions Made by Referrer</label>
                                        <textarea readOnly rows={3} value={viewFormReq.actions_made || ''} className="w-full bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-gray-700 cursor-not-allowed resize-none"></textarea>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Date / Duration of Observations</label>
                                        <textarea readOnly rows={2} value={viewFormReq.date_duration_of_observations || ''} className="w-full bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-gray-700 cursor-not-allowed resize-none"></textarea>
                                    </div>
                                    {/* Signature */}
                                    {viewFormReq.referrer_signature && (
                                        <div className="mb-4">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Name and Signature of the Referring Person</label>
                                            <div className="bg-white border-2 border-dashed border-purple-200 rounded-xl p-4 flex flex-col items-center">
                                                <img src={viewFormReq.referrer_signature} alt="Referrer Signature" className="max-h-24 object-contain" />
                                                <div className="w-48 border-t border-gray-400 mt-2 pt-1 text-center">
                                                    <p className="text-sm font-bold text-gray-800">{viewFormReq.referred_by}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {/* Scheduled info */}
                                    {viewFormReq.scheduled_date && (
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-3 flex gap-3 items-center"><Calendar size={16} className="text-blue-600" /><div><p className="text-xs font-bold text-blue-800 uppercase">Scheduled Session</p><p className="text-sm text-blue-900">{new Date(viewFormReq.scheduled_date).toLocaleString()}</p></div></div>
                                    )}
                                    {viewFormReq.resolution_notes && (
                                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-3"><p className="text-xs font-bold text-green-800 uppercase mb-1">Resolution Notes</p><p className="text-sm text-green-900">{viewFormReq.resolution_notes}</p></div>
                                    )}
                                    {/* Button to view student form */}
                                    <div className="flex gap-3 mt-4">
                                        <button onClick={() => handleDownloadReferralForm(viewFormReq)} className="flex-1 py-3 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold text-sm hover:bg-green-100 transition-all flex items-center justify-center gap-2">
                                            <Download size={16} /> Download PDF
                                        </button>
                                        <button onClick={() => setFormModalView('student')} className="flex-1 py-3 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all flex items-center justify-center gap-2">
                                            <FileText size={16} /> View Student Form
                                        </button>
                                    </div>
                                </>
                            ) : (
                                /* Show Student Self-Referral Form view */
                                <>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-extrabold text-lg">STUDENT SELF-REFERRAL FOR COUNSELING FORM</h3>
                                            <p className="text-xs text-gray-400 mt-1">Office of the Director, Counseling, Assessment, Resources, and Enhancement Center</p>
                                            <p className="text-[10px] text-gray-400 mt-1">Submitted: {new Date(viewFormReq.created_at).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${viewFormReq.status === 'Submitted' ? 'bg-gray-100 text-gray-600' : viewFormReq.status === 'Rejected' ? 'bg-red-100 text-red-700' : viewFormReq.status === 'Referred' ? 'bg-purple-100 text-purple-700' : viewFormReq.status === 'Staff_Scheduled' ? 'bg-indigo-100 text-indigo-700' : viewFormReq.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{viewFormReq.status === 'Submitted' ? 'Pending Review' : viewFormReq.status === 'Staff_Scheduled' ? 'Staff Scheduled' : viewFormReq.status === 'Referred' ? 'Forwarded' : viewFormReq.status}</span>
                                            <button onClick={() => { setShowCounselingFormModal(false); setFormModalView('referral'); }} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Name of Student</label><input readOnly value={viewFormReq.student_name || ''} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 cursor-not-allowed" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Course & Year</label><input readOnly value={viewFormReq.course_year || ''} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 cursor-not-allowed" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Contact Number</label><input readOnly value={viewFormReq.contact_number || 'Not set'} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 cursor-not-allowed" /></div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Reason/s for Requesting Counseling</label>
                                        <textarea readOnly rows={4} value={viewFormReq.reason_for_referral || viewFormReq.description || ''} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 cursor-not-allowed resize-none"></textarea>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Personal Actions Taken</label>
                                        <textarea readOnly rows={3} value={viewFormReq.personal_actions_taken || ''} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 cursor-not-allowed resize-none"></textarea>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Date / Duration of Concern</label>
                                        <textarea readOnly rows={2} value={viewFormReq.date_duration_of_concern || ''} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 cursor-not-allowed resize-none"></textarea>
                                    </div>
                                    {viewFormReq.scheduled_date && (
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-3 flex gap-3 items-center"><Calendar size={16} className="text-blue-600" /><div><p className="text-xs font-bold text-blue-800 uppercase">Scheduled Session</p><p className="text-sm text-blue-900">{new Date(viewFormReq.scheduled_date).toLocaleString()}</p></div></div>
                                    )}
                                    {viewFormReq.resolution_notes && (
                                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-3"><p className="text-xs font-bold text-green-800 uppercase mb-1">Resolution Notes</p><p className="text-sm text-green-900">{viewFormReq.resolution_notes}</p></div>
                                    )}
                                    {/* Button to go back to referral form */}
                                    {viewFormReq.referred_by && (
                                        <button onClick={() => setFormModalView('referral')} className="w-full mt-2 py-3 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl font-bold text-sm hover:bg-purple-100 transition-all flex items-center justify-center gap-2">
                                            <FileText size={16} /> View Referral Form
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        {/* Action buttons */}
                        <div className="p-6 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white rounded-b-2xl">
                            {(viewFormReq.status === 'Referred' || viewFormReq.status === 'Pending') && (
                                <button onClick={() => { setShowCounselingFormModal(false); setFormModalView('referral'); setSelectedApp(viewFormReq); setShowScheduleModal(true); }} className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-all">Schedule Session</button>
                            )}
                            {(viewFormReq.status === 'Scheduled' || viewFormReq.status === 'Staff_Scheduled') && (
                                <button onClick={() => { setShowCounselingFormModal(false); setFormModalView('referral'); setCompletionForm({ ...completionForm, id: viewFormReq.id, student_id: viewFormReq.student_id }); setShowCompleteModal(true); }} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all">Mark as Complete</button>
                            )}
                            <button onClick={() => { setShowCounselingFormModal(false); setFormModalView('referral'); }} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CounselingPage;
