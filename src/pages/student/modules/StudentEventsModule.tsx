import React from 'react';
import ServiceIntroModal from './ServiceIntroModal';

export default function StudentEventsModule({ p }: { p: any }) {
    const { activeView, fetchHistory, Icons, eventFilter, setEventFilter, eventsList, attendanceMap, setSelectedEvent, selectedEvent, setProofFile, handleTimeIn, handleTimeOut, isTimingIn, ratedEvents, handleRateEvent } = p;

    return (
        <>                    {activeView === 'events' && <ServiceIntroModal serviceKey="events" />}
                    {activeView === 'events' && (
                        <div className="student-module student-events-module page-transition">
                            <div className="flex justify-between items-start mb-8 animate-fade-in-up">
                                <div><h2 className="text-2xl font-extrabold mb-1 text-gray-800">Events & Announcements</h2><p className="text-sm text-gray-400">Stay updated with campus activities and important news.</p></div>
                                <button onClick={fetchHistory} className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 font-bold transition-colors"><Icons.Clock /> Refresh</button>
                                <div className="flex bg-white/80 backdrop-blur-sm p-1 rounded-xl gap-1 border border-purple-100/50 shadow-sm">{['All', 'Events', 'Announcements'].map(f => (<button key={f} onClick={() => setEventFilter(f)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${eventFilter === f ? 'bg-gradient-to-r from-blue-500 to-sky-400 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-gray-900 hover:bg-purple-50'}`}>{f}</button>))}</div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {eventsList.map((item: any, idx: number) => {
                                    if (eventFilter === 'Events' && item.type !== 'Event') return null;
                                    if (eventFilter === 'Announcements' && item.type !== 'Announcement') return null;
                                    const record = attendanceMap[item.id]; const isTimedIn = !!record?.time_in; const isTimedOut = !!record?.time_out;
                                    const now = new Date(); const start = new Date(`${item.event_date}T${item.event_time}`); const end = item.end_time ? new Date(`${item.event_date}T${item.end_time}`) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
                                    const canTimeIn = now >= start && !isTimedIn; const canTimeOut = isTimedIn && !isTimedOut && now >= end;
                                    return (
                                        <div key={item.id} onClick={() => setSelectedEvent(item)} className={`student-surface-card bg-white/80 backdrop-blur-sm rounded-2xl border-l-4 p-8 shadow-sm relative cursor-pointer card-hover animate-fade-in-up ${item.type === 'Event' ? 'border-l-purple-500' : 'border-l-indigo-400'}`} style={{ animationDelay: `${idx * 100}ms` }}>
                                            <div className="flex justify-between items-start mb-6"><span className="bg-gradient-to-r from-slate-800 to-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">{item.type}</span>{item.type === 'Event' && isTimedIn && (<span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1"><Icons.CheckCircle /> Attended</span>)}</div>
                                            <h3 className="text-xl font-bold mb-4 text-gray-800">{item.title}</h3><p className="text-sm text-gray-400 mb-8 leading-relaxed line-clamp-3">{item.description}</p>
                                            <div className="space-y-3 mb-8"><p className="text-xs text-gray-400 flex items-center gap-3 font-medium"><Icons.Events /> {item.event_date}</p>{item.type === 'Event' && (<><p className="text-xs text-gray-400 flex items-center gap-3 font-medium"><Icons.Clock /> {item.event_time}</p><p className="text-xs text-gray-400 flex items-center gap-3 font-medium"><Icons.Support /> {item.location}</p></>)}</div>
                                            {item.type === 'Event' && (<div className="flex flex-col gap-3" onClick={e => e.stopPropagation()}>{!isTimedIn && (<div className="space-y-2">{canTimeIn && <input type="file" accept="image/*" onChange={(e: any) => setProofFile(e.target.files[0])} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />}</div>)}
                                                <div className="flex gap-2"><button disabled={!canTimeIn || isTimingIn || isTimedIn} onClick={() => handleTimeIn(item)} className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${isTimedIn ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default' : (!canTimeIn || isTimingIn ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-sky-400 text-white hover:from-blue-400 hover:to-sky-300 shadow-lg shadow-blue-500/20')}`}>{isTimedIn ? <span><Icons.CheckCircle /> Checked In</span> : (isTimingIn ? 'Processing...' : (now < start ? `Starts ${item.event_time}` : '→] Time In'))}</button>
                                                    <button disabled={!canTimeOut} onClick={() => handleTimeOut(item)} className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${isTimedOut ? 'bg-gray-100 text-gray-400 cursor-default' : (!canTimeOut ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500 shadow-lg shadow-red-500/20')}`}>{isTimedOut ? 'Completed' : (now < end ? `Ends ${item.end_time || 'Later'}` : '←[ Time Out')}</button></div>
                                                {isTimedOut && !ratedEvents.includes(item.id) && (<button onClick={() => !ratedEvents.includes(item.id) && handleRateEvent(item)} disabled={ratedEvents.includes(item.id)} className={`w-full py-3 border rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 btn-press ${ratedEvents.includes(item.id) ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-default' : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 shadow-sm'}`}><Icons.Star filled={true} /> {ratedEvents.includes(item.id) ? 'Rated' : 'Rate'}</button>)}</div>)}
                                            <p className="text-[10px] text-purple-500 font-bold mt-4 text-right">Click for full details →</p>
                                        </div>);
                                })}
                            </div>
                            {/* Event/Announcement Detail Modal */}
                            {selectedEvent && (() => {
                                const record = attendanceMap[selectedEvent.id]; const isTimedIn = !!record?.time_in; const isTimedOut = !!record?.time_out;
                                const now = new Date(); const start = new Date(`${selectedEvent.event_date}T${selectedEvent.event_time}`); const end = selectedEvent.end_time ? new Date(`${selectedEvent.event_date}T${selectedEvent.end_time}`) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
                                const canTimeIn = now >= start && !isTimedIn; const canTimeOut = isTimedIn && !isTimedOut && now >= end;
                                return (
                                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
                                        <div className="student-modal-surface bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-2xl shadow-2xl shadow-blue-500/20 max-h-[90vh] overflow-y-auto animate-fade-in-up" onClick={e => e.stopPropagation()}>
                                            <div className="relative">
                                                <div className={`h-3 w-full rounded-t-2xl ${selectedEvent.type === 'Event' ? 'bg-black' : 'bg-blue-500'}`}></div>
                                                <button onClick={() => setSelectedEvent(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-xl">✕</button>
                                            </div>
                                            <div className="p-8">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="bg-gray-100 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest">{selectedEvent.type}</span>
                                                    {selectedEvent.type === 'Event' && isTimedIn && <span className="bg-green-100 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1"><Icons.CheckCircle /> Attended</span>}
                                                </div>
                                                <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
                                                <p className="text-sm text-gray-600 leading-relaxed mb-8">{selectedEvent.description}</p>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Date</p>
                                                        <p className="text-sm font-bold flex items-center gap-2"><Icons.Events /> {selectedEvent.event_date}</p>
                                                    </div>
                                                    {selectedEvent.type === 'Event' && (<>
                                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Time</p>
                                                            <p className="text-sm font-bold flex items-center gap-2"><Icons.Clock /> {selectedEvent.event_time}{selectedEvent.end_time && ` - ${selectedEvent.end_time}`}</p>
                                                        </div>
                                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Location</p>
                                                            <p className="text-sm font-bold flex items-center gap-2"><Icons.Support /> {selectedEvent.location}</p>
                                                        </div>
                                                    </>)}
                                                </div>
                                                {selectedEvent.type === 'Event' && (
                                                    <div className="border-t pt-6">
                                                        <h4 className="font-bold text-sm mb-4">Attendance</h4>
                                                        {isTimedIn && isTimedOut ? (
                                                            <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                                                                <Icons.CheckCircle />
                                                                <p className="text-sm font-bold text-green-800 mt-1">Attendance completed!</p>
                                                                <p className="text-xs text-green-600">You have successfully checked in and out of this event.</p>
                                                            </div>
                                                        ) : isTimedIn ? (
                                                            <div className="space-y-3">
                                                                <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-sm text-green-700 font-bold flex items-center gap-2"><Icons.CheckCircle /> Checked In</div>
                                                                <button disabled={!canTimeOut} onClick={() => handleTimeOut(selectedEvent)} className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${!canTimeOut ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}>{now < end ? `Time Out available after ${selectedEvent.end_time || 'event ends'}` : '←[ Time Out'}</button>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                {canTimeIn && <input type="file" accept="image/*" onChange={(e: any) => setProofFile(e.target.files[0])} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />}
                                                                <button disabled={!canTimeIn || isTimingIn} onClick={() => handleTimeIn(selectedEvent)} className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${!canTimeIn || isTimingIn ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100'}`}>{isTimingIn ? 'Processing...' : (now < start ? `Check-in opens at ${selectedEvent.event_time}` : '→] Time In')}</button>
                                                            </div>
                                                        )}
                                                        {isTimedOut && !ratedEvents.includes(selectedEvent.id) && (
                                                            <button onClick={() => { setSelectedEvent(null); handleRateEvent(selectedEvent); }} className="w-full mt-4 py-3 border border-yellow-100 bg-yellow-50 text-yellow-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-yellow-100"><Icons.Star filled={true} /> Rate this event</button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}        </>
    );
}

