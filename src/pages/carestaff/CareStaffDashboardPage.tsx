import React from 'react';
import CareStaffSidebar from './CareStaffSidebar';
import CareStaffHeader from './CareStaffHeader';
import CareStaffMainContent from './CareStaffMainContent';
import CareStaffOverlays from './CareStaffOverlays';
import useCareStaffDashboardController from './useCareStaffDashboardController';

const CareStaffDashboard = () => {
    const p = useCareStaffDashboardController();

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 text-gray-800 font-sans overflow-hidden">
            <CareStaffSidebar p={p} />
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <CareStaffHeader p={p} />
                <CareStaffMainContent p={p} />
            </main>
            <CareStaffOverlays p={p} />
        </div>
    );
};

export default CareStaffDashboard;

