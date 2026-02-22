import React from 'react';
import {
    LayoutDashboard,
    Activity,
    Users,
    BarChart2,
    FileText,
    CheckCircle,
    Calendar,
    Award,
    ClipboardList,
    Star,
    Shield,
    BookOpen,
    XCircle,
    LogOut
} from 'lucide-react';

const CareStaffSidebar = ({ p }: { p: any }) => {
    const { sidebarOpen, setSidebarOpen, activeTab, setActiveTab, logout, navigate } = p;

    return (
        <>
            {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden animate-backdrop" onClick={() => setSidebarOpen(false)} />}

            <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-gradient-sidebar transform transition-all duration-500 ease-out lg:static lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0 shadow-2xl shadow-purple-900/30' : '-translate-x-full'}`}>
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-purple rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-purple-600/30 text-sm">CS</div>
                        <div>
                            <h1 className="font-bold text-white text-lg tracking-tight">CARE Staff</h1>
                            <p className="text-purple-300/70 text-xs font-medium">NORSU Portal</p>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-purple-300/60 hover:text-white transition-colors"><XCircle size={20} /></button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {[
                        { tab: 'home', icon: <LayoutDashboard size={18} />, label: 'Home' },
                        { tab: 'dashboard', icon: <Activity size={18} />, label: 'Dashboard' },
                    ].map(item => (
                        <button key={item.tab} onClick={() => setActiveTab(item.tab)} className={`nav-item w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${activeTab === item.tab ? 'nav-item-active text-purple-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            {item.icon} {item.label}
                        </button>
                    ))}

                    <div className="pt-5 mt-4 border-t border-white/5">
                        <p className="px-4 text-[10px] font-bold text-purple-400/50 uppercase tracking-[0.15em] mb-3">Student Management</p>
                        {[
                            { tab: 'population', icon: <Users size={18} />, label: 'Student Population' },
                            { tab: 'analytics', icon: <BarChart2 size={18} />, label: 'Student Analytics' },
                        ].map(item => (
                            <button key={item.tab} onClick={() => setActiveTab(item.tab)} className={`nav-item w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${activeTab === item.tab ? 'nav-item-active text-purple-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="pt-5 mt-4 border-t border-white/5">
                        <p className="px-4 text-[10px] font-bold text-purple-400/50 uppercase tracking-[0.15em] mb-3">Services</p>
                        {[
                            { tab: 'nat', icon: <FileText size={18} />, label: 'NAT Management' },
                            { tab: 'counseling', icon: <Users size={18} />, label: 'Counseling' },
                            { tab: 'support', icon: <CheckCircle size={18} />, label: 'Support Requests' },
                            { tab: 'events', icon: <Calendar size={18} />, label: 'Events' },
                            { tab: 'scholarship', icon: <Award size={18} />, label: 'Scholarships' },
                        ].map(item => (
                            <button key={item.tab} onClick={() => setActiveTab(item.tab)} className={`nav-item w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${activeTab === item.tab ? 'nav-item-active text-purple-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="pt-5 mt-4 border-t border-white/5">
                        <p className="px-4 text-[10px] font-bold text-purple-400/50 uppercase tracking-[0.15em] mb-3">Administration</p>
                        {[
                            { tab: 'forms', icon: <ClipboardList size={18} />, label: 'Forms' },
                            { tab: 'feedback', icon: <Star size={18} />, label: 'Feedback' },
                            { tab: 'audit', icon: <Shield size={18} />, label: 'Audit Logs' },
                            { tab: 'logbook', icon: <BookOpen size={18} />, label: 'Office Logbook' },
                        ].map(item => (
                            <button key={item.tab} onClick={() => setActiveTab(item.tab)} className={`nav-item w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${activeTab === item.tab ? 'nav-item-active text-purple-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button onClick={() => { logout(); navigate('/care-staff'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400/80 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default CareStaffSidebar;
