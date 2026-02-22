import React from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

const EnhancedToastOverlay = ({ p }: { p: any }) => {
    const {
        toast,
        setToast
    } = p;

    return (
        <>
            {/* ENHANCED TOAST NOTIFICATION */}
            {toast && (
                <div className="fixed bottom-6 right-24 z-50 bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-2xl shadow-purple-100/30 rounded-2xl p-4 flex items-center gap-4 animate-slide-in-right overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${toast.type === 'success' ? 'bg-gradient-to-b from-green-400 to-emerald-500' :
                        toast.type === 'error' ? 'bg-gradient-to-b from-red-400 to-rose-500' :
                            'bg-gradient-to-b from-blue-400 to-indigo-500'
                        }`} />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${toast.type === 'success' ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md shadow-green-200/50' :
                        toast.type === 'error' ? 'bg-gradient-to-br from-red-400 to-rose-500 text-white shadow-md shadow-red-200/50' :
                            'bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-md shadow-blue-200/50'
                        }`}>
                        {toast.type === 'success' ? <CheckCircle size={20} /> :
                            toast.type === 'error' ? <AlertTriangle size={20} /> :
                                <Info size={20} />}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">
                            {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Notification'}
                        </h4>
                        <p className="text-xs text-gray-500 max-w-[200px]">{toast.msg}</p>
                    </div>
                    <button onClick={() => setToast(null)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
                        <XCircle size={16} className="text-gray-400" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
                        <div className={`h-full animate-shrink ${toast.type === 'success' ? 'bg-green-400' :
                            toast.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                            }`} />
                    </div>
                </div>
            )}

        </>
    );
};

export default EnhancedToastOverlay;
