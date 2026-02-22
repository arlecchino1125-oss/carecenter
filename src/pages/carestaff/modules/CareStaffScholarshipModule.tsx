import React from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';

const CareStaffScholarshipModule = ({ p }: { p: any }) => {
    const {
        scholarships,
        setShowScholarshipModal,
        handleViewApplicants,
        handleDeleteScholarship
    } = p;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Scholarship Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage active scholarships and view applicants.</p>
                </div>
                <button onClick={() => setShowScholarshipModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all duration-300">
                    <Plus size={14} /> Add Scholarship
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships.map(s => (
                    <div key={s.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                                    <Award size={20} />
                                </div>
                                <div className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                    Deadline: {new Date(s.deadline).toLocaleDateString()}
                                </div>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4">{s.description}</p>
                        </div>
                        <div className="pt-4 border-t border-gray-50 flex gap-2">
                            <button onClick={() => handleViewApplicants(s)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition">View Applicants</button>
                            <button onClick={() => handleDeleteScholarship(s.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
                {scholarships.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p>No active scholarships found. Click "Add Scholarship" to create one.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareStaffScholarshipModule;
