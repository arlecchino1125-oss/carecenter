import React from 'react';
import { Search, Download } from 'lucide-react';
import StatusBadge from '../../../components/StatusBadge';

const CareStaffApplicationsModule = ({ p }: { p: any }) => {
    const {
        applications,
        searchTerm,
        setSearchTerm,
        downloadCSV,
        setSelectedApp,
        setShowApplicationModal
    } = p;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="font-bold text-gray-900 text-lg">NAT Applications</h3>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full md:w-64" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                    <button onClick={downloadCSV} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"><Download size={16} /> Export</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500"><tr><th className="p-4">Applicant</th><th className="p-4">Contact</th><th className="p-4">Preference</th><th className="p-4">Status</th><th className="p-4 text-right">Action</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {applications.filter(a => `${a.first_name} ${a.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())).map(app => (
                            <tr key={app.id} className="hover:bg-gray-50">
                                <td className="p-4"><p className="font-bold text-gray-900">{app.first_name} {app.last_name}</p><p className="text-xs text-gray-500">ID: {app.id.substring(0, 8)}</p></td>
                                <td className="p-4"><p>{app.email}</p><p className="text-xs text-gray-500">{app.mobile}</p></td>
                                <td className="p-4 text-gray-600">{app.priority_course}</td>
                                <td className="p-4"><StatusBadge status={app.status} /></td>
                                <td className="p-4 text-right"><button onClick={() => { setSelectedApp(app); setShowApplicationModal(true); }} className="text-purple-600 font-bold hover:underline">Manage</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CareStaffApplicationsModule;
