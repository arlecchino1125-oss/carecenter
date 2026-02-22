import React from 'react';
import { Download, XCircle, Paperclip, CheckCircle } from 'lucide-react';

const SupportCompletionOverlays = ({ p }: { p: any }) => {
    const {
        showSupportModal,
        selectedSupportReq,
        setShowSupportModal,
        handlePrintSupport,
        selectedStudent,
        renderDetailedDescription,
        supportForm,
        setSupportForm,
        handleForwardSupport,
        handleFinalizeSupport,
        showCompleteModal,
        handleCompleteSession,
        completionForm,
        setCompletionForm,
        setShowCompleteModal
    } = p;

    return (
        <>
            {showSupportModal && selectedSupportReq && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-backdrop" onClick={() => setShowSupportModal(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl h-full shadow-2xl shadow-purple-900/10 flex flex-col animate-slide-in-right">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-xl text-gray-900 gradient-text">Support Application</h3>
                                <p className="text-xs text-gray-500 mt-1">Review details and take action</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handlePrintSupport} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-50 text-blue-600 transition" title="Print Application"><Download size={16} /></button>
                                <button onClick={() => setShowSupportModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"><XCircle size={18} /></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Student Information Section */}
                            <section className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h4 className="font-bold text-sm text-purple-600 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">Student Information</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><label className="block text-xs font-bold text-gray-500">Full Name</label><div className="font-semibold text-gray-900">{selectedSupportReq.student_name}</div></div>
                                    <div><label className="block text-xs font-bold text-gray-500">Date Filed</label><div className="font-semibold text-gray-900">{new Date(selectedSupportReq.created_at).toLocaleDateString()}</div></div>
                                    <div><label className="block text-xs font-bold text-gray-500">Date of Birth</label><div className="font-semibold text-gray-900">{selectedStudent?.dob || '-'}</div></div>
                                    <div><label className="block text-xs font-bold text-gray-500">Program — Year</label><div className="font-semibold text-gray-900">{selectedStudent?.course || '-'} - {selectedStudent?.year_level || '-'}</div></div>
                                    <div><label className="block text-xs font-bold text-gray-500">Mobile</label><div className="font-semibold text-gray-900">{selectedStudent?.mobile || '-'}</div></div>
                                    <div><label className="block text-xs font-bold text-gray-500">Email</label><div className="font-semibold text-gray-900">{selectedStudent?.email || '-'}</div></div>
                                    <div className="col-span-2"><label className="block text-xs font-bold text-gray-500">Home Address</label><div className="font-semibold text-gray-900">{selectedStudent?.address || '-'}</div></div>
                                </div>
                            </section>

                            {/* Section A: Studies */}
                            <section>
                                <h4 className="font-bold text-sm text-purple-600 mb-3 uppercase tracking-wider border-b pb-1">A. Your Studies</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-500">1st Priority:</span><span className="font-medium text-gray-900">{selectedStudent?.priority_course || 'N/A'}</span></div>
                                    <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-500">2nd Priority:</span><span className="font-medium text-gray-900">{selectedStudent?.alt_course_1 || 'N/A'}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">3rd Priority:</span><span className="font-medium text-gray-900">{selectedStudent?.alt_course_2 || 'N/A'}</span></div>
                                </div>
                            </section>

                            {/* Categories & Particulars */}
                            <section>
                                <h4 className="font-bold text-sm text-purple-600 mb-3 uppercase tracking-wider border-b pb-1">B. Particulars of Need</h4>
                                <div className="mb-4">
                                    <p className="text-xs font-bold text-gray-600 mb-1">Categories:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedSupportReq.support_type ? selectedSupportReq.support_type.split(', ').map((cat: string, i: number) => (
                                            <span key={i} className="bg-white border border-gray-200 px-2 py-1 rounded text-xs text-gray-700">{cat}</span>
                                        )) : <span className="text-xs text-gray-400">None</span>}
                                    </div>
                                </div>
                                {renderDetailedDescription(selectedSupportReq.description)}
                                {selectedSupportReq.documents_url && (
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                        <a href={selectedSupportReq.documents_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:underline font-bold flex items-center gap-2"><Paperclip size={14} /> View Supporting Documents</a>
                                    </div>
                                )}
                            </section>

                            {/* Action Section */}
                            <section className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h4 className="font-bold text-sm text-gray-700 mb-4 uppercase tracking-wider">Staff Actions</h4>

                                {selectedSupportReq.status === 'Submitted' && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">CARE Staff Notes (For Dept Head)</label>
                                        <textarea rows={3} value={supportForm.care_notes} onChange={e => setSupportForm({ ...supportForm, care_notes: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Add endorsement notes..."></textarea>
                                        <button onClick={handleForwardSupport} className="w-full mt-2 bg-yellow-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-yellow-600">Forward to Dept Head</button>
                                    </div>
                                )}

                                {selectedSupportReq.status === 'Forwarded to Dept' && (
                                    <div className="text-center text-sm text-gray-500 italic py-4">Waiting for Department Head review...</div>
                                )}

                                {(selectedSupportReq.status === 'Approved' || selectedSupportReq.status === 'Rejected') && (
                                    <div>
                                        <div className={`p-3 rounded-lg mb-3 ${selectedSupportReq.status === 'Approved' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                            <p className="text-xs font-bold uppercase">Dept Head Decision: {selectedSupportReq.status}</p>
                                            <p className="text-sm mt-1">{selectedSupportReq.dept_notes || 'No notes provided.'}</p>
                                        </div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Final Resolution / Ideas for Student</label>
                                        <textarea rows={3} value={supportForm.resolution_notes} onChange={e => setSupportForm({ ...supportForm, resolution_notes: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Provide solution or next steps..."></textarea>
                                        <button onClick={handleFinalizeSupport} className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-green-700">Notify Student & Complete</button>
                                    </div>
                                )}

                                {selectedSupportReq.status === 'Completed' && (
                                    <p className="text-xs text-green-600 font-bold bg-green-50 p-2 rounded"><CheckCircle size={12} className="inline mr-1" /> Request Resolved</p>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            )}
            {showCompleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-backdrop">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scale-in">
                        <h3 className="font-bold text-lg mb-4 gradient-text">Complete Counseling Session</h3>
                        <form onSubmit={handleCompleteSession} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Public Resolution Notes</label>
                                <textarea rows={4} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Provide advice, recommendations, or next steps..." value={completionForm.publicNotes} onChange={e => setCompletionForm({ ...completionForm, publicNotes: e.target.value })}></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Confidential Notes</label>
                                <textarea className="w-full border rounded-lg p-2 text-sm bg-red-50" rows={3} placeholder="Private notes for staff only..." value={completionForm.privateNotes} onChange={e => setCompletionForm({ ...completionForm, privateNotes: e.target.value })}></textarea>
                                <p className="text-[10px] text-red-500 mt-1">* Only visible to Guidance Staff</p>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowCompleteModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700">Complete Session</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default SupportCompletionOverlays;
