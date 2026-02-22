import React from 'react';
import { createPortal } from 'react-dom';
import ServiceIntroModal from './ServiceIntroModal';

export default function StudentCounselingModule({ p }: { p: any }) {
    const { activeView, counselingRequests, setShowCounselingRequestsModal, showCounselingRequestsModal, showCounselingForm, setShowCounselingForm, personalInfo, counselingForm, setCounselingForm, submitCounselingRequest, isSubmitting, openRequestModal, selectedRequest, setSelectedRequest, formatFullDate, sessionFeedback, setSessionFeedback, submitSessionFeedback, Icons } = p;

    return (
        <>            {activeView === 'counseling' && <ServiceIntroModal serviceKey="counseling" />}
            {activeView === 'counseling' && (
                <div className="student-module student-counseling-module max-w-6xl mx-auto space-y-6 page-transition relative">
                    <div className="mb-6 animate-fade-in-up flex justify-between items-start">
                        <div><h2 className="text-2xl font-extrabold mb-1 text-gray-800">Counseling Services</h2><p className="text-sm text-gray-400">Request counseling support and view your requests</p></div>
                        <button onClick={() => setShowCounselingRequestsModal(true)} className="student-surface-card relative flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-purple-100/50 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-purple-50 transition-all shadow-sm btn-press">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            Your Requests
                            {counselingRequests.length > 0 && <span className="bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{counselingRequests.length}</span>}
                        </button>
                    </div>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="student-surface-card bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-purple-100/50 flex items-center gap-4 shadow-sm card-hover animate-fade-in-up" style={{ animationDelay: '80ms' }}><div className="p-3 bg-gradient-to-br from-blue-500 to-sky-400 text-white rounded-xl shadow-lg shadow-blue-500/20"><Icons.Counseling /></div><div><p className="text-2xl font-black">{counselingRequests.length}</p><p className="text-xs text-gray-400 font-bold uppercase">Total Requests</p></div></div>
                        <div className="student-surface-card bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-purple-100/50 flex items-center gap-4 shadow-sm card-hover animate-fade-in-up" style={{ animationDelay: '160ms' }}><div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-xl shadow-lg shadow-amber-500/20"><Icons.Clock /></div><div><p className="text-2xl font-black">{counselingRequests.filter((r: any) => ['Referred', 'Scheduled'].includes(r.status)).length}</p><p className="text-xs text-gray-400 font-bold uppercase">Pending</p></div></div>
                        <div className="student-surface-card bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-purple-100/50 flex items-center gap-4 shadow-sm card-hover animate-fade-in-up" style={{ animationDelay: '240ms' }}><div className="p-3 bg-gradient-to-br from-emerald-400 to-green-500 text-white rounded-xl shadow-lg shadow-emerald-500/20"><Icons.CheckCircle /></div><div><p className="text-2xl font-black">{counselingRequests.filter((r: any) => r.status === 'Completed').length}</p><p className="text-xs text-gray-400 font-bold uppercase">Completed</p></div></div>
                    </div>
                    {/* CTA Card — always visible */}
                    <div className="student-surface-card bg-white/90 backdrop-blur-sm rounded-xl border border-blue-100/50 p-12 text-center shadow-sm card-hover animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💬</div>
                        <h3 className="font-bold text-lg mb-2">Need Counseling Support?</h3>
                        <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">Our counseling services are here to help you with academic stress, personal concerns, and general wellbeing.</p>
                        <button onClick={() => setShowCounselingForm(true)} className="bg-gradient-to-r from-blue-500 to-sky-400 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 btn-press transition-all">Request Counseling</button>
                    </div>
                    {/* Self-Referral Modal */}
                    {showCounselingForm && createPortal(
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="student-modal-surface bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-purple-100/50 animate-fade-in-up">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-extrabold text-lg">STUDENT SELF-REFERRAL FOR COUNSELING FORM</h3>
                                        <p className="text-xs text-gray-400 mt-1">Office of the Director, Counseling, Assessment, Resources, and Enhancement Center</p>
                                    </div>
                                    <button onClick={() => setShowCounselingForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">Name of Student</label><input readOnly value={`${personalInfo.firstName} ${personalInfo.lastName}`} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 cursor-not-allowed" /></div>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">Course & Year</label><input readOnly value={`${personalInfo.course || ''} - ${personalInfo.year || ''}`} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 cursor-not-allowed" /></div>
                                    <div className="md:col-span-2 md:w-1/2"><label className="block text-xs font-bold text-gray-500 mb-1">Contact Number</label><input readOnly value={personalInfo.mobile || 'Not set'} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 cursor-not-allowed" /></div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Reason/s for Requesting Counseling <span className="text-red-400">*</span></label>
                                    <p className="text-[10px] text-gray-400 mb-2">Briefly describe your reason/s for seeking counseling.</p>
                                    <textarea rows={4} value={counselingForm.reason_for_referral} onChange={e => setCounselingForm({ ...counselingForm, reason_for_referral: e.target.value })} className="w-full bg-purple-50/50 border border-purple-100/50 rounded-xl p-4 text-sm outline-none focus:border-purple-300 transition-colors" placeholder="Describe your reason/s for seeking counseling..."></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Personal Actions Taken</label>
                                    <p className="text-[10px] text-gray-400 mb-2">What have you done to address your concern?</p>
                                    <textarea rows={3} value={counselingForm.personal_actions_taken} onChange={e => setCounselingForm({ ...counselingForm, personal_actions_taken: e.target.value })} className="w-full bg-purple-50/50 border border-purple-100/50 rounded-xl p-4 text-sm outline-none focus:border-purple-300 transition-colors" placeholder="Describe any steps you've taken..."></textarea>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Date / Duration of Concern</label>
                                    <textarea rows={2} value={counselingForm.date_duration_of_concern} onChange={e => setCounselingForm({ ...counselingForm, date_duration_of_concern: e.target.value })} className="w-full bg-purple-50/50 border border-purple-100/50 rounded-xl p-4 text-sm outline-none focus:border-purple-300 transition-colors" placeholder="e.g. Since January 2026, approximately 3 weeks..."></textarea>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={submitCounselingRequest} disabled={isSubmitting} className="bg-gradient-to-r from-blue-500 to-sky-400 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 btn-press transition-all">{isSubmitting ? 'Submitting...' : 'Submit Request'}</button>
                                    <button onClick={() => setShowCounselingForm(false)} className="bg-white/80 border border-purple-100/50 px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">Cancel</button>
                                </div>
                            </div>
                        </div>
                        , document.body)}
                    {/* Counseling Requests Modal */}
                    {showCounselingRequestsModal && createPortal(
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50" onClick={() => setShowCounselingRequestsModal(false)}>
                            <div className="student-modal-surface bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
                                <div className="px-6 py-5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white flex-shrink-0">
                                    <div className="flex justify-between items-center">
                                        <div><h3 className="text-lg font-extrabold">Your Requests</h3><p className="text-xs text-purple-200 mt-0.5">{counselingRequests.length} total request{counselingRequests.length !== 1 ? 's' : ''}</p></div>
                                        <button onClick={() => setShowCounselingRequestsModal(false)} className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-lg">✕</button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {counselingRequests.length === 0 ? (
                                        <div className="text-center py-12"><p className="text-gray-400 text-sm">No requests found.</p></div>
                                    ) : counselingRequests.map((req: any, idx: number) => (
                                        <div key={req.id} onClick={() => { setShowCounselingRequestsModal(false); openRequestModal(req); }} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-purple-200 transition-all" style={{ animationDelay: `${idx * 60}ms` }}>
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-lg">📝</span>
                                                    <span className="text-sm font-bold text-gray-900">{req.request_type || 'Self-Referral'}</span>
                                                </div>
                                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${req.status === 'Submitted' ? 'bg-gray-100 text-gray-600' : req.status === 'Rejected' ? 'bg-red-100 text-red-700' : req.status === 'Referred' ? 'bg-purple-100 text-purple-700' : req.status === 'Staff_Scheduled' ? 'bg-indigo-100 text-indigo-700' : req.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : req.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{req.status === 'Submitted' ? 'Pending Review' : req.status === 'Staff_Scheduled' ? 'With CARE Staff' : req.status === 'Referred' ? 'Forwarded' : req.status}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400">{formatFullDate(new Date(req.created_at))}</p>
                                            <p className="text-[10px] text-purple-500 font-bold mt-2">Click to view full form →</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        , document.body)}
                    {/* Request Details Modal */}
                    {selectedRequest && createPortal(
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="student-modal-surface bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-purple-100/50 animate-fade-in-up">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-extrabold text-lg">STUDENT SELF-REFERRAL FOR COUNSELING FORM</h3>
                                        <p className="text-xs text-gray-400 mt-1">Office of the Director, Counseling, Assessment, Resources, and Enhancement Center</p>
                                        <p className="text-[10px] text-gray-400 mt-1">Submitted: {formatFullDate(new Date(selectedRequest.created_at))}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${selectedRequest.status === 'Submitted' ? 'bg-gray-100 text-gray-600' : selectedRequest.status === 'Rejected' ? 'bg-red-100 text-red-700' : selectedRequest.status === 'Referred' ? 'bg-purple-100 text-purple-700' : selectedRequest.status === 'Staff_Scheduled' ? 'bg-indigo-100 text-indigo-700' : selectedRequest.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{selectedRequest.status === 'Submitted' ? 'Pending Review' : selectedRequest.status === 'Staff_Scheduled' ? 'With CARE Staff' : selectedRequest.status === 'Referred' ? 'Forwarded to CARE Staff' : selectedRequest.status}</span>
                                        <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                                    </div>
                                </div>
                                {/* Read-only form fields — same layout as self-referral */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">Name of Student</label><input readOnly value={selectedRequest.student_name || ''} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 cursor-not-allowed" /></div>
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">Course & Year</label><input readOnly value={selectedRequest.course_year || ''} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 cursor-not-allowed" /></div>
                                    <div className="md:col-span-2 md:w-1/2"><label className="block text-xs font-bold text-gray-500 mb-1">Contact Number</label><input readOnly value={selectedRequest.contact_number || 'Not set'} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 cursor-not-allowed" /></div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Reason/s for Requesting Counseling</label>
                                    <textarea readOnly rows={4} value={selectedRequest.reason_for_referral || selectedRequest.description || ''} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 cursor-not-allowed resize-none"></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Personal Actions Taken</label>
                                    <textarea readOnly rows={3} value={selectedRequest.personal_actions_taken || ''} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 cursor-not-allowed resize-none"></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Date / Duration of Concern</label>
                                    <textarea readOnly rows={2} value={selectedRequest.date_duration_of_concern || ''} className="w-full bg-gray-100 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 cursor-not-allowed resize-none"></textarea>
                                </div>
                                {/* Status-specific info cards */}
                                <div className="space-y-3 mt-6">
                                    {selectedRequest.referred_by && (
                                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100"><p className="text-xs font-bold text-purple-800 uppercase mb-1">Forwarded to CARE Staff by</p><p className="text-sm text-purple-900">{selectedRequest.referred_by}</p></div>
                                    )}
                                    {selectedRequest.scheduled_date && (
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-center"><Icons.Clock className="text-blue-600" /><div><p className="text-xs font-bold text-blue-800 uppercase">Scheduled Session</p><p className="text-sm text-blue-900">{new Date(selectedRequest.scheduled_date).toLocaleString()}</p></div></div>
                                    )}
                                    {selectedRequest.status === 'Rejected' && (
                                        <div className="bg-red-50 p-4 rounded-xl border border-red-100"><p className="text-xs font-bold text-red-800 uppercase mb-1">Request Rejected</p><p className="text-sm text-red-900 leading-relaxed">{selectedRequest.resolution_notes || 'Your request has been reviewed and was not approved at this time.'}</p></div>
                                    )}
                                    {selectedRequest.status === 'Completed' && selectedRequest.resolution_notes && (
                                        <div className="bg-green-50 p-4 rounded-xl border border-green-100"><p className="text-xs font-bold text-green-800 uppercase mb-1">Counselor's Advice</p><p className="text-sm text-green-900 leading-relaxed">{selectedRequest.resolution_notes}</p></div>
                                    )}
                                    {selectedRequest.status === 'Completed' && (
                                        <div className="border-t pt-6">
                                            <h4 className="font-bold text-sm mb-4">Rate your Session</h4>
                                            {selectedRequest.rating ? (
                                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
                                                    <div className="flex justify-center gap-1 text-yellow-500 mb-2">{[1, 2, 3, 4, 5].map(n => <div key={n} className="scale-75"><Icons.Star filled={n <= selectedRequest.rating} /></div>)}</div>
                                                    <p className="text-sm text-yellow-800 italic">"{selectedRequest.feedback || 'No comment provided.'}"</p>
                                                    <p className="text-[10px] text-yellow-600 mt-2 font-bold uppercase">Thank you for your feedback!</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="flex justify-center gap-2">{[1, 2, 3, 4, 5].map(num => (<button key={num} onClick={() => setSessionFeedback({ ...sessionFeedback, rating: num })} className="hover:scale-110 transition-transform"><Icons.Star filled={num <= sessionFeedback.rating} /></button>))}</div>
                                                    <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500" rows={3} placeholder="How was your session? (Optional)" value={sessionFeedback.comment} onChange={e => setSessionFeedback({ ...sessionFeedback, comment: e.target.value })}></textarea>
                                                    <button onClick={submitSessionFeedback} className="w-full bg-gradient-to-r from-blue-500 to-sky-400 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 btn-press transition-all">Submit Feedback</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        , document.body)}
                </div>
            )}        </>
    );
}

