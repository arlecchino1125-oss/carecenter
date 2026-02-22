import React from 'react';
import { XCircle, MapPin, Download } from 'lucide-react';
import { exportToExcel } from '../../../../utils/dashboardUtils';

const EventFlowOverlays = ({ p }: { p: any }) => {
    const {
        showEventModal,
        editingEventId,
        setShowEventModal,
        setEditingEventId,
        createEvent,
        newEvent,
        setNewEvent,
        getCurrentLocation,
        showAttendeesModal,
        attendees,
        attendeeFilter,
        setAttendeeFilter,
        attendeeCourseFilter,
        setAttendeeCourseFilter,
        yearLevelFilter,
        setYearLevelFilter,
        attendeeSectionFilter,
        setAttendeeSectionFilter,
        selectedEventTitle,
        setShowAttendeesModal,
        showFeedbackModal,
        setShowFeedbackModal,
        feedbackList
    } = p;

    return (
        <>
            {showEventModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-backdrop">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
                        <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-purple-50/30 flex justify-between items-center">
                            <h3 className="font-bold text-lg gradient-text">{editingEventId ? 'Edit Item' : 'Create New Item'}</h3>
                            <button onClick={() => { setShowEventModal(false); setEditingEventId(null); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><XCircle className="text-gray-400 hover:text-gray-600" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <form onSubmit={createEvent} className="space-y-4">
                                <div><label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                                    <select className="w-full border rounded-lg p-2 text-sm" value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}>
                                        <option value="Event">Event</option>
                                        <option value="Announcement">Announcement</option>
                                    </select>
                                </div>
                                <div><label className="block text-xs font-bold text-gray-500 mb-1">Title</label><input required className="w-full border rounded-lg p-2 text-sm" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="e.g., Campus Fair 2026" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 mb-1">Description</label><textarea required className="w-full border rounded-lg p-2 text-sm" rows={3} value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} placeholder="Details..."></textarea></div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-xs font-bold text-gray-500 mb-1">Date</label><input type="date" required className="w-full border rounded-lg p-2 text-sm" value={newEvent.event_date} onChange={e => setNewEvent({ ...newEvent, event_date: e.target.value })} /></div>
                                    {newEvent.type === 'Event' && (
                                        <div><label className="block text-xs font-bold text-gray-500 mb-1">Start Time</label><input type="time" className="w-full border rounded-lg p-2 text-sm" value={newEvent.event_time} onChange={e => setNewEvent({ ...newEvent, event_time: e.target.value })} /></div>
                                    )}
                                </div>

                                {newEvent.type === 'Event' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="block text-xs font-bold text-gray-500 mb-1">End Time</label><input type="time" className="w-full border rounded-lg p-2 text-sm" value={newEvent.end_time} onChange={e => setNewEvent({ ...newEvent, end_time: e.target.value })} /></div>
                                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Location</label><input className="w-full border rounded-lg p-2 text-sm" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} placeholder="e.g., Main Gym" /></div>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-xs font-bold text-blue-700">Geolocation</label>
                                                <div className="flex gap-3">
                                                    <button type="button" onClick={getCurrentLocation} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"><MapPin size={12} /> Get My Location</button>
                                                    <button type="button" onClick={() => setNewEvent({ ...newEvent, latitude: '9.306', longitude: '123.306' })} className="text-xs text-gray-500 hover:underline flex items-center gap-1"><MapPin size={12} /> Reset to Campus</button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input type="number" step="any" placeholder="Lat" className="w-full border rounded-lg p-2 text-xs" value={newEvent.latitude} onChange={e => setNewEvent({ ...newEvent, latitude: e.target.value })} />
                                                <input type="number" step="any" placeholder="Long" className="w-full border rounded-lg p-2 text-xs" value={newEvent.longitude} onChange={e => setNewEvent({ ...newEvent, longitude: e.target.value })} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="pt-4 flex gap-3">
                                    <button type="button" onClick={() => { setShowEventModal(false); setEditingEventId(null); }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50">Cancel</button>
                                    <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 shadow-md">{editingEventId ? 'Update' : 'Create'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Attendees Modal */}
            {showAttendeesModal && (() => {
                const depts = [...new Set((attendees.map((a: any) => a.department).filter(Boolean) as any[]))].sort();
                const yearLevels = [...new Set((attendees.map((a: any) => a.year_level).filter(Boolean) as any[]))].sort();
                const courses = [...new Set((attendees.map((a: any) => a.course).filter(Boolean) as any[]))].sort();
                const sections = [...new Set((attendees.map((a: any) => a.section).filter(Boolean) as any[]))].sort();
                let filtered = attendeeFilter === 'All' ? attendees : attendees.filter(a => a.department === attendeeFilter);
                if (attendeeCourseFilter !== 'All') filtered = filtered.filter(a => a.course === attendeeCourseFilter);
                if (yearLevelFilter !== 'All') filtered = filtered.filter(a => a.year_level === yearLevelFilter);
                if (attendeeSectionFilter !== 'All') filtered = filtered.filter(a => a.section === attendeeSectionFilter);
                const completedCount = attendees.filter(a => a.time_out).length;
                return (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[80vh]">
                            <div className="p-6 border-b bg-gray-50 rounded-t-2xl">
                                <div className="flex justify-between items-center mb-3">
                                    <div><h3 className="font-bold text-lg">Attendees List</h3><p className="text-xs text-gray-500">{selectedEventTitle}</p></div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => {
                                            if (filtered.length === 0) return;
                                            const headers = ['Student Name', 'Department', 'Course', 'Year Level', 'Section', 'Time In', 'Time Out', 'Status'];
                                            const rows = filtered.map(a => [a.student_name, a.department || '', a.course || '', a.year_level || '', a.section || '', new Date(a.time_in).toLocaleString(), a.time_out ? new Date(a.time_out).toLocaleString() : '-', a.time_out ? 'Completed' : 'Still In']);
                                            exportToExcel(headers, rows, `${selectedEventTitle || 'event'}_attendees`);
                                        }} disabled={filtered.length === 0} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition shadow-sm disabled:opacity-50">
                                            <Download size={14} /> Export Excel
                                        </button>
                                        <button onClick={() => { setShowAttendeesModal(false); setAttendeeFilter('All'); setYearLevelFilter('All'); setAttendeeCourseFilter('All'); setAttendeeSectionFilter('All'); }}><XCircle className="text-gray-400 hover:text-gray-600" /></button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs mb-3">
                                    <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-bold">{attendees.length} Total</span>
                                    <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold">{completedCount} Completed</span>
                                    <span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-bold">{attendees.length - completedCount} Still In</span>
                                </div>
                                {depts.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase mr-1 self-center">Dept:</span>
                                        <button onClick={() => setAttendeeFilter('All')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${attendeeFilter === 'All' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>All ({attendees.length})</button>
                                        {depts.map((dept: any) => {
                                            const count = attendees.filter(a => a.department === dept).length;
                                            return <button key={dept} onClick={() => setAttendeeFilter(dept)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${attendeeFilter === dept ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>{dept} ({count})</button>;
                                        })}
                                    </div>
                                )}
                                {yearLevels.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase mr-1 self-center">Year:</span>
                                        <button onClick={() => setYearLevelFilter('All')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${yearLevelFilter === 'All' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>All</button>
                                        {yearLevels.map((yl: any) => {
                                            const count = attendees.filter(a => a.year_level === yl).length;
                                            return <button key={yl} onClick={() => setYearLevelFilter(yl)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${yearLevelFilter === yl ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>{yl} ({count})</button>;
                                        })}
                                    </div>
                                )}
                                {courses.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase mr-1 self-center">Course:</span>
                                        <button onClick={() => setAttendeeCourseFilter('All')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${attendeeCourseFilter === 'All' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>All</button>
                                        {courses.map((c: any) => {
                                            const count = attendees.filter(a => a.course === c).length;
                                            return <button key={c} onClick={() => setAttendeeCourseFilter(c)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${attendeeCourseFilter === c ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>{c} ({count})</button>;
                                        })}
                                    </div>
                                )}
                                {sections.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase mr-1 self-center">Section:</span>
                                        <button onClick={() => setAttendeeSectionFilter('All')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${attendeeSectionFilter === 'All' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>All</button>
                                        {sections.map((s: any) => {
                                            const count = attendees.filter(a => a.section === s).length;
                                            return <button key={s} onClick={() => setAttendeeSectionFilter(s)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${attendeeSectionFilter === s ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>Sec {s} ({count})</button>;
                                        })}
                                    </div>
                                )}
                            </div>
                            <div className="p-0 overflow-y-auto flex-1">
                                {filtered.length === 0 ? <p className="text-center py-8 text-gray-500">No attendees yet.</p> : (
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 sticky top-0"><tr><th className="px-6 py-3">Student</th><th className="px-6 py-3">Course</th><th className="px-6 py-3">Year / Sec</th><th className="px-6 py-3">Time In</th><th className="px-6 py-3">Time Out</th><th className="px-6 py-3">Location</th></tr></thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filtered.map((att, i) => (
                                                <tr key={i} className="hover:bg-gray-50">
                                                    <td className="px-6 py-3"><p className="font-bold text-gray-900">{att.student_name}</p><p className="text-xs text-gray-500">{att.department}</p></td>
                                                    <td className="px-6 py-3 text-gray-600 text-xs font-medium">{att.course || '-'}</td>
                                                    <td className="px-6 py-3 text-gray-600 text-xs font-medium">{att.year_level || '-'}{att.section ? ` — ${att.section}` : ''}</td>
                                                    <td className="px-6 py-3 text-gray-600">{new Date(att.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                    <td className="px-6 py-3">{att.time_out ? <span className="text-green-600 font-medium">{new Date(att.time_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> : <span className="text-yellow-600 text-xs font-bold">Still In</span>}</td>
                                                    <td className="px-6 py-3 text-xs">
                                                        {att.latitude ? <a href={`https://maps.google.com/?q=${att.latitude},${att.longitude}`} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1"><MapPin size={12} />Map</a> : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Feedback Modal */}
            {showFeedbackModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[80vh]">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <div><h3 className="font-bold text-lg">Event Feedback</h3><p className="text-xs text-gray-500">{selectedEventTitle}</p></div>
                            <button onClick={() => setShowFeedbackModal(false)}><XCircle className="text-gray-400 hover:text-gray-600" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            {feedbackList.length === 0 ? <p className="text-center text-gray-500">No feedback submitted yet.</p> : feedbackList.map((fb, i) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                                        {[...Array(5)].map((_, idx) => <i key={idx} className={`fa-solid fa-star ${idx < fb.rating ? '' : 'text-gray-300'}`}></i>)}
                                        <span className="text-xs font-bold text-gray-600 ml-2">{fb.rating}/5</span>
                                    </div>
                                    <p className="text-sm text-gray-700 italic">"{fb.comments}"</p>
                                    <p className="text-xs text-gray-400 mt-2 text-right">{new Date(fb.submitted_at).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EventFlowOverlays;
