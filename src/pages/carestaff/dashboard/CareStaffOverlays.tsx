import React from 'react';
import ApplicationScheduleOverlays from './overlays/ApplicationScheduleOverlays';
import ScholarshipOverlays from './overlays/ScholarshipOverlays';
import EventFlowOverlays from './overlays/EventFlowOverlays';
import SimpleToastOverlay from './overlays/SimpleToastOverlay';
import SupportCompletionOverlays from './overlays/SupportCompletionOverlays';
import CommandHubOverlay from './overlays/CommandHubOverlay';
import EnhancedToastOverlay from './overlays/EnhancedToastOverlay';
import DeleteEventOverlay from './overlays/DeleteEventOverlay';
import SystemStudentOverlays from './overlays/SystemStudentOverlays';

const CareStaffOverlays = ({ p }: { p: any }) => {
    return (
        <>
            <ApplicationScheduleOverlays p={p} />
            <ScholarshipOverlays p={p} />
            <EventFlowOverlays p={p} />
            <SimpleToastOverlay p={p} />
            <SupportCompletionOverlays p={p} />
            <CommandHubOverlay p={p} />
            <EnhancedToastOverlay p={p} />
            <DeleteEventOverlay p={p} />
            <SystemStudentOverlays p={p} />
        </>
    );
};

export default CareStaffOverlays;
