import {
    FileText, CheckCircle, Send, AlertTriangle,
    Filter, ClipboardList, GraduationCap
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

const SupportRequestsPage = ({
    supportReqs, supportTab, setSupportTab,
    supportCategory, setSupportCategory,
    openSupportModal
}: any) => {
    return (
        <>
            <div>
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <ClipboardList size={24} className="text-purple-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Additional Support Management</h1>
                    </div>
                    <p className="text-gray-500 text-sm">Manage and respond to student support requests across all categories</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'New Requests', value: supportReqs.filter(r => r.status === 'Submitted').length, icon: <FileText size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'With Dept Head', value: supportReqs.filter(r => r.status === 'Forwarded to Dept').length, icon: <Send size={20} />, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                        { label: 'Action Needed', value: supportReqs.filter(r => r.status === 'Approved' || r.status === 'Rejected').length, icon: <AlertTriangle size={20} />, color: 'text-orange-500', bg: 'bg-orange-50' },
                        { label: 'Completed', value: supportReqs.filter(r => r.status === 'Completed').length, icon: <CheckCircle size={20} />, color: 'text-green-500', bg: 'bg-green-50' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3 ${stat.color}`}>{stat.icon}</div>
                            <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="bg-gray-100 rounded-full p-1 flex items-center justify-start gap-2 mb-6 overflow-x-auto max-w-fit">
                    <button onClick={() => setSupportTab('queue')} className={`px-6 py-2 rounded-full text-sm font-bold transition ${supportTab === 'queue' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Request Queue ({supportReqs.filter(r => r.status !== 'Approved' && r.status !== 'Completed' && r.status !== 'Rejected').length})</button>
                    <button onClick={() => setSupportTab('approved')} className={`px-6 py-2 rounded-full text-sm font-bold transition ${supportTab === 'approved' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Approved / Monitoring ({supportReqs.filter(r => r.status === 'Approved' || r.status === 'Completed' || r.status === 'Rejected').length})</button>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-xl border border-gray-100 w-fit">
                    <Filter size={16} className="text-gray-400" />
                    <select value={supportCategory} onChange={e => setSupportCategory(e.target.value)} className="text-xs font-bold text-gray-700 focus:outline-none bg-transparent">
                        {['All', 'Working Student Support', 'Indigenous Persons Support', 'Orphan Support', 'Financial Hardship'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {supportReqs
                        .filter(req => {
                            if (supportTab === 'queue') return req.status !== 'Approved' && req.status !== 'Completed' && req.status !== 'Rejected';
                            return req.status === 'Approved' || req.status === 'Completed' || req.status === 'Rejected';
                        })
                        .filter(req => supportCategory === 'All' || (req.support_type && req.support_type.includes(supportCategory)))
                        .map(req => (
                            <div key={req.id} className="card-hover bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100/80 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-200/50"><GraduationCap size={18} className="text-white" /></div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{req.student_name}</h4>
                                                <p className="text-xs text-gray-500">{new Date(req.created_at).toLocaleDateString()} • {req.student_id}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={req.status} />
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium mb-2">{req.support_type}</p>
                                </div>
                                <div className="flex gap-3 border-t border-gray-100/50 pt-4 mt-auto">
                                    <button onClick={() => openSupportModal(req)} className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01]"><ClipboardList size={16} /> Manage Request</button>
                                </div>
                            </div>
                        ))}
                </div>
                {supportReqs.length === 0 && <p className="text-center text-gray-500 py-8">No requests found.</p>}
            </div>
        </>
    );
};

export default SupportRequestsPage;
