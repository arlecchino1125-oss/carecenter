import React from 'react';
import { XCircle, FileText, Trash2 } from 'lucide-react';

const ApplicationScheduleOverlays = ({ p }: { p: any }) => {
    const {
        showApplicationModal,
        selectedApp,
        setShowApplicationModal,
        handleAppAction,
        handleDeleteApplication,
        showScheduleModal,
        setShowScheduleModal,
        handleScheduleSubmit,
        scheduleData,
        setScheduleData
    } = p;

    return (
        <>
            {showApplicationModal && selectedApp && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-backdrop">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
                        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-gray-50 to-purple-50/30">
                            <h3 className="font-bold text-lg gradient-text">Application Details</h3>
                            <button onClick={() => setShowApplicationModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><XCircle className="text-gray-400 hover:text-gray-600" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 text-sm">
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div><label className="text-xs text-gray-500 font-bold uppercase">Applicant</label><p className="font-medium text-lg">{selectedApp.first_name} {selectedApp.last_name}</p></div>
                                <div><label className="text-xs text-gray-500 font-bold uppercase">Course Preference</label><p className="font-medium text-lg text-purple-600">{selectedApp.priority_course}</p></div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                                <h4 className="font-bold mb-3 flex items-center gap-2"><FileText size={16} /> Grades & Requirements</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-gray-500 text-xs">GWA</span><p className="font-bold">{selectedApp.gwa || 'N/A'}</p></div>
                                    <div><span className="text-gray-500 text-xs">Math</span><p className="font-bold">{selectedApp.math_grade || 'N/A'}</p></div>
                                    <div><span className="text-gray-500 text-xs">Science</span><p className="font-bold">{selectedApp.science_grade || 'N/A'}</p></div>
                                    <div><span className="text-gray-500 text-xs">English</span><p className="font-bold">{selectedApp.english_grade || 'N/A'}</p></div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => handleAppAction(selectedApp.id, 'Approved')} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-200 transition-all duration-300 hover:scale-[1.01]">Approve Application</button>
                                <button onClick={() => handleAppAction(selectedApp.id, 'Rejected')} className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 border border-red-200 transition-all duration-200">Reject</button>
                                <button onClick={() => handleDeleteApplication(selectedApp.id)} className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 hover:text-red-600 transition-all duration-200" title="Delete Application"><Trash2 size={20} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule Modal */}
            {showScheduleModal && selectedApp && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-backdrop">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
                        <h3 className="font-bold text-lg mb-4 gradient-text">Schedule Session</h3>
                        <p className="text-sm text-gray-500 mb-6">Set a date and time for {selectedApp.student_name}'s counseling.</p>
                        <form onSubmit={handleScheduleSubmit} className="space-y-4">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Date</label><input type="date" required className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:border-purple-400 transition-colors" value={scheduleData.date} onChange={e => setScheduleData({ ...scheduleData, date: e.target.value })} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Time</label><input type="time" required className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:border-purple-400 transition-colors" value={scheduleData.time} onChange={e => setScheduleData({ ...scheduleData, time: e.target.value })} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Notes</label>
                                <textarea rows={4} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={scheduleData.notes} onChange={e => setScheduleData({ ...scheduleData, notes: e.target.value })} placeholder="Add any notes or instructions for the student..."></textarea>
                            </div>
                            <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:scale-[1.01]">Confirm Schedule</button>
                        </form>
                    </div>
                </div>
            )}

        </>
    );
};

export default ApplicationScheduleOverlays;
