import {
    Plus, Calendar, Clock, MapPin, Users, Star
} from 'lucide-react';

const EventsPage = ({
    events, eventFilter, setEventFilter,
    setEditingEventId, setNewEvent, setShowEventModal,
    handleViewFeedback, handleViewAttendees,
    handleEditEvent, handleDeleteEvent
}: any) => {
    return (
        <>
            <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Events & Announcements</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage campus activities and broadcast official notices.</p>
                    </div>
                    <button onClick={() => { setEditingEventId(null); setNewEvent({ title: '', description: '', event_date: '', event_time: '', end_time: '', location: '', latitude: '', longitude: '', type: 'Event' }); setShowEventModal(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-200 hover:scale-[1.02] transition-all duration-300"><Plus size={14} /> Create New</button>
                </div>

                {/* Filter Tabs */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                        {['All Items', 'Events', 'Announcements'].map(tab => (
                            <button key={tab} onClick={() => setEventFilter(tab)} className={`px-4 py-2 rounded-md text-sm font-medium transition ${eventFilter === tab ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-700'}`}>{tab}</button>
                        ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-white px-3 py-1 rounded-md border border-gray-200">Total: {events.length}</span>
                </div>

                <div className="space-y-4">
                    {events
                        .filter(i => eventFilter === 'All Items' || (eventFilter === 'Events' && i.type === 'Event') || (eventFilter === 'Announcements' && i.type === 'Announcement'))
                        .map(item => (
                            <div key={item.id} className="card-hover bg-white/80 backdrop-blur-sm border border-gray-100/80 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden group">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.type === 'Event' ? 'bg-blue-100 text-blue-700' : item.type === 'Priority' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'}`}>{item.type}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                                        {item.location && <span className="flex items-center gap-1"><MapPin size={12} />{item.location}</span>}
                                        {item.event_date && <span className="flex items-center gap-1"><Calendar size={12} />{item.event_date}</span>}
                                        {item.event_time && <span className="flex items-center gap-1"><Clock size={12} />{item.event_time}</span>}
                                        {item.end_time && <span className="text-gray-400 text-[10px] ml-1">- {item.end_time}</span>}
                                        {item.type === 'Event' && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold ml-2 flex items-center gap-1"><Users size={12} />{item.attendees || 0} Attendees</span>}
                                        {item.type === 'Event' && item.avgRating && <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold ml-2 flex items-center gap-1"><Star size={12} />{item.avgRating} <span className="font-normal opacity-75">({item.feedbackCount})</span></span>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {item.type === 'Event' && (
                                        <>
                                            <button onClick={() => handleViewFeedback(item)} className="px-4 py-2 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-lg hover:bg-yellow-100 transition flex items-center gap-1"><Star size={14} /> Feedback</button>
                                            <button onClick={() => handleViewAttendees(item)} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition">Attendees</button>
                                        </>
                                    )}
                                    <button onClick={() => handleEditEvent(item)} className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition">Edit</button>
                                    <button onClick={() => handleDeleteEvent(item.id)} className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition">Delete</button>
                                </div>
                            </div>
                        ))}
                    {events.length === 0 && <div className="text-center py-8 text-gray-400">No events or announcements found.</div>}
                </div>
            </div>
        </>
    );
};

export default EventsPage;
