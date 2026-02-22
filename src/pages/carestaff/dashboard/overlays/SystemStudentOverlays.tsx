import React from 'react';
import { AlertTriangle, XCircle, User, MapPin, GraduationCap } from 'lucide-react';

const SystemStudentOverlays = ({ p }: { p: any }) => {
    const {
        showResetModal,
        setShowResetModal,
        handleResetSystem,
        showEditModal,
        setShowEditModal,
        handleUpdateStudent,
        editForm,
        setEditForm,
        allCourses,
        showDeleteModal,
        studentToDelete,
        setShowDeleteModal,
        confirmDeleteStudent
    } = p;

    return (
        <>
            {showResetModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-backdrop">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-rose-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-200/50">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">System Reset</h3>
                            <p className="text-gray-500 text-sm mb-6">âš ï¸ WARNING: This will DELETE ALL user-submitted data (Students, Applications, Logs, etc.). This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowResetModal(false)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all duration-200">Cancel</button>
                                <button onClick={handleResetSystem} className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-200 transition-all duration-300 hover:scale-[1.01]">Yes, Wipe Data</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
            {/* Lifted Edit Student Modal (Shared) */}
            {
                showEditModal && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
                        <div className="relative bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-slide-in-right">
                            <div className="px-6 py-5 border-b flex justify-between items-center bg-slate-50">
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900">Student Profile</h3>
                                    <p className="text-xs text-slate-500">View and edit full student details</p>
                                </div>
                                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition"><XCircle size={24} className="text-slate-400" /></button>
                            </div>

                            <form onSubmit={handleUpdateStudent} className="flex-1 overflow-y-auto p-8 space-y-8">
                                {/* Personal Information */}
                                <section>
                                    <h4 className="font-bold text-sm text-blue-600 mb-4 border-b border-blue-100 pb-2 flex items-center gap-2"><User size={16} /> Personal Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">First Name</label><input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" value={editForm.first_name || ''} onChange={e => setEditForm({ ...editForm, first_name: e.target.value })} /></div>
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Last Name</label><input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" value={editForm.last_name || ''} onChange={e => setEditForm({ ...editForm, last_name: e.target.value })} /></div>
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Middle Name</label><input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" value={editForm.middle_name || ''} onChange={e => setEditForm({ ...editForm, middle_name: e.target.value })} /></div>
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Suffix</label><input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" value={editForm.suffix || ''} onChange={e => setEditForm({ ...editForm, suffix: e.target.value })} /></div>

                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Date of Birth</label><input type="date" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" value={editForm.dob || ''} onChange={e => setEditForm({ ...editForm, dob: e.target.value })} /></div>
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Place of Birth</label><input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" value={editForm.place_of_birth || ''} onChange={e => setEditForm({ ...editForm, place_of_birth: e.target.value })} /></div>

                                        <div>
                                            <label className="block text-xs font-bold mb-1 text-slate-700">Sex</label>
                                            <select className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white" value={editForm.sex || ''} onChange={e => setEditForm({ ...editForm, sex: e.target.value })}>
                                                <option value="">Select...</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold mb-1 text-slate-700">Gender Identity</label>
                                            <input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" value={editForm.gender_identity || ''} onChange={e => setEditForm({ ...editForm, gender_identity: e.target.value })} placeholder="e.g. LGBTQ+" />
                                        </div>

                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Civil Status</label>
                                            <select className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white" value={editForm.civil_status || ''} onChange={e => setEditForm({ ...editForm, civil_status: e.target.value })}>
                                                <option value="">Select...</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Widowed">Widowed</option>
                                            </select>
                                        </div>
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Nationality</label><input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" value={editForm.nationality || ''} onChange={e => setEditForm({ ...editForm, nationality: e.target.value })} /></div>
                                    </div>
                                </section>

                                <section>
                                    <h4 className="font-bold text-sm text-green-600 mb-4 border-b border-green-100 pb-2 flex items-center gap-2"><MapPin size={16} /> Address & Contact</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="col-span-2"><label className="block text-xs font-bold mb-1 text-slate-700">Street / Info</label><input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" value={editForm.street || ''} onChange={e => setEditForm({ ...editForm, street: e.target.value })} /></div>
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">City/Municipality</label><input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" value={editForm.city || ''} onChange={e => setEditForm({ ...editForm, city: e.target.value })} /></div>
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Province</label><input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" value={editForm.province || ''} onChange={e => setEditForm({ ...editForm, province: e.target.value })} /></div>
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Zip Code</label><input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" value={editForm.zip_code || ''} onChange={e => setEditForm({ ...editForm, zip_code: e.target.value })} /></div>
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Mobile</label><input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" value={editForm.mobile || ''} onChange={e => setEditForm({ ...editForm, mobile: e.target.value })} /></div>
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Email</label><input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /></div>
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Facebook</label><input className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" value={editForm.facebook_url || ''} onChange={e => setEditForm({ ...editForm, facebook_url: e.target.value })} /></div>
                                    </div>
                                </section>

                                <section>
                                    <h4 className="font-bold text-sm text-purple-600 mb-4 border-b border-purple-100 pb-2 flex items-center gap-2"><GraduationCap size={16} /> Academic Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Student ID</label><input disabled className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-sm text-slate-500 cursor-not-allowed" value={editForm.student_id || ''} /></div>
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Course</label>
                                            <select className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none bg-white" value={editForm.course || ''} onChange={e => setEditForm({ ...editForm, course: e.target.value })}>
                                                {allCourses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Year Level</label>
                                            <select className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none bg-white" value={editForm.year_level || ''} onChange={e => setEditForm({ ...editForm, year_level: e.target.value })}>
                                                <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                                            </select>
                                        </div>
                                        <div><label className="block text-xs font-bold mb-1 text-slate-700">Status</label>
                                            <select className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none bg-white" value={editForm.status || ''} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                                                <option>Active</option><option>Inactive</option><option>Probation</option><option>Graduated</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                <div className="pt-6 flex justify-end gap-3 border-t border-slate-200 sticky bottom-0 bg-white/95 backdrop-blur-sm p-4 -mx-8 -mb-8 shadow-inner">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition">Cancel</button>
                                    <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            {/* Lifted Delete Student Modal (Shared) */}
            {showDeleteModal && studentToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 text-center max-w-sm">
                        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold mb-2">Delete Student?</h3>
                        <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete {studentToDelete.first_name}?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={confirmDeleteStudent} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SystemStudentOverlays;
