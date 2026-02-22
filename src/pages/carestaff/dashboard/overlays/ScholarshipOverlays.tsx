import React from 'react';
import { XCircle, Download } from 'lucide-react';

const ScholarshipOverlays = ({ p }: { p: any }) => {
    const {
        showScholarshipModal,
        setShowScholarshipModal,
        scholarshipForm,
        setScholarshipForm,
        handleAddScholarship,
        loading,
        showApplicantModal,
        selectedScholarship,
        handleExportApplicants,
        setShowApplicantModal,
        applicantsList
    } = p;

    return (
        <>
            {showScholarshipModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Add New Scholarship</h3>
                            <button onClick={() => setShowScholarshipModal(false)}><XCircle className="text-gray-400 hover:text-gray-600" /></button>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Scholarship Title</label><input className="w-full border rounded-lg p-2 text-sm" value={scholarshipForm.title} onChange={e => setScholarshipForm({ ...scholarshipForm, title: e.target.value })} placeholder="e.g. Academic Excellence 2026" /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Description</label><textarea className="w-full border rounded-lg p-2 text-sm" rows={3} value={scholarshipForm.description} onChange={e => setScholarshipForm({ ...scholarshipForm, description: e.target.value })} placeholder="Overview..."></textarea></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Requirements</label><textarea className="w-full border rounded-lg p-2 text-sm" rows={3} value={scholarshipForm.requirements} onChange={e => setScholarshipForm({ ...scholarshipForm, requirements: e.target.value })} placeholder="List requirements..."></textarea></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Deadline</label><input type="date" className="w-full border rounded-lg p-2 text-sm" value={scholarshipForm.deadline} onChange={e => setScholarshipForm({ ...scholarshipForm, deadline: e.target.value })} /></div>

                            <button onClick={handleAddScholarship} disabled={loading} className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition mt-2">{loading ? 'Adding...' : 'Post Scholarship'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Scholarship Applicants Modal */}
            {showApplicantModal && selectedScholarship && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[85vh] animate-scale-in">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <div><h3 className="font-bold text-lg">Applicants List</h3><p className="text-xs text-gray-500">{selectedScholarship.title}</p></div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleExportApplicants} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition"><Download size={14} /> Export Excel</button>
                                <button onClick={() => setShowApplicantModal(false)}><XCircle className="text-gray-400 hover:text-gray-600" /></button>
                            </div>
                        </div>
                        <div className="p-0 overflow-y-auto flex-1">
                            {applicantsList.length === 0 ? <div className="text-center py-12 text-gray-400">No applicants yet.</div> : (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 sticky top-0"><tr><th className="px-6 py-3">Student Name</th><th className="px-6 py-3">Course & Year</th><th className="px-6 py-3">Contact</th><th className="px-6 py-3">Date Applied</th></tr></thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {applicantsList.map((app, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-6 py-3"><p className="font-bold text-gray-900">{app.student_name}</p><p className="text-xs text-gray-500">{app.email}</p></td>
                                                <td className="px-6 py-3 text-gray-600">{app.course} - {app.year_level}</td>
                                                <td className="px-6 py-3 text-gray-600">{app.contact_number}</td>
                                                <td className="px-6 py-3 text-gray-500">{new Date(app.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default ScholarshipOverlays;
