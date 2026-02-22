import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteEventOverlay = ({ p }: { p: any }) => {
    const {
        showDeleteEventModal,
        setShowDeleteEventModal,
        setEventToDelete,
        confirmDeleteEvent
    } = p;

    return (
        <>
            {showDeleteEventModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-scale-in">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Event?</h3>
                        <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => { setShowDeleteEventModal(false); setEventToDelete(null); }} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                            <button onClick={confirmDeleteEvent} className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all">Delete</button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default DeleteEventOverlay;
