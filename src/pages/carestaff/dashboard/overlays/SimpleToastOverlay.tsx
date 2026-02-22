import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';

const SimpleToastOverlay = ({ p }: { p: any }) => {
    const {
        toast
    } = p;

    return (
        <>
            {toast && (
                <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl text-white flex items-center gap-3 animate-slide-in-up z-50 ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
                    <div className="text-xl">{toast.type === 'error' ? <XCircle /> : <CheckCircle />}</div>
                    <div><h4 className="font-bold text-sm">{toast.type === 'error' ? 'Error' : 'Success'}</h4><p className="text-xs opacity-90">{toast.msg}</p></div>
                </div>
            )}

        </>
    );
};

export default SimpleToastOverlay;
