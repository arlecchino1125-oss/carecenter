import React from 'react';

export default function StudentPortalSidebar({ isSidebarOpen, setIsSidebarOpen, sidebarLinks, activeView, setActiveView, setIsEditing, Icons }: any) {
    return (
        <>
            <aside className={`student-portal-sidebar fixed inset-y-0 left-0 z-30 w-72 bg-gradient-student-sidebar transform transition-all duration-500 ease-out lg:static lg:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0 shadow-2xl shadow-blue-900/30' : '-translate-x-full'}`}>
                {/* Logo Area */}
                <div className="student-sidebar-header p-6 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="student-sidebar-logo w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30 text-sm">SP</div>
                        <div>
                            <h1 className="student-sidebar-title font-bold text-white text-lg tracking-tight">Student</h1>
                            <p className="student-sidebar-subtitle text-sky-300/70 text-xs font-medium">NORSU Portal</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-sky-200/70 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></svg></button>
                </div>

                {/* Navigation */}
                <nav className="student-sidebar-nav flex-1 overflow-y-auto p-4 space-y-1">
                    {['Core', 'Academic', 'Services', 'Activities'].map((group, gi) => (
                        <div key={group} className={gi > 0 ? 'student-sidebar-group pt-5 mt-4 border-t border-white/5' : ''}>
                            <p className="px-4 text-[10px] font-bold text-blue-300/55 uppercase tracking-[0.16em] mb-3">{group}</p>
                            {sidebarLinks.filter(link => link.group === group).map((link: any) => (
                                <button key={link.id} id={`nav-${link.id}`} onClick={() => { setActiveView(link.id); setIsEditing(false); setIsSidebarOpen(false); }} className={`student-nav-item nav-item nav-item-student w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${activeView === link.id ? 'nav-item-active text-sky-200' : 'text-slate-300/75 hover:text-white hover:bg-white/5'}`}>
                                    <link.icon /> {link.label}
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* Logout */}
                <div className="student-sidebar-footer p-4 border-t border-white/5">
                    <button onClick={() => window.location.href = '/student/login'} className="student-logout-btn w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-300/85 hover:text-red-200 hover:bg-red-500/10 rounded-xl transition-all"><Icons.Logout /> Logout</button>
                </div>
            </aside>
        </>
    );
}
