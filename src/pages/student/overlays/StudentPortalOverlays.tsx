import React from 'react';
import { createPortal } from 'react-dom';

export function StudentTourOverlay({ p }: { p: any }) {
    const { showTour, highlightRect, currentTourStep, TOUR_STEPS, tourStep, handleTourNext } = p;

    return (
        <>
            {showTour && createPortal(
                <div className="fixed inset-0 z-[10000] overflow-hidden pointer-events-auto">
                    {/* Dark backdrop with cutout */}
                    <div className="absolute inset-0 bg-black/60 transition-all duration-300 pointer-events-none" style={
                        highlightRect ? {
                            clipPath: `polygon(
                                0% 0%, 0% 100%, 
                                ${highlightRect.left - 8}px 100%, 
                                ${highlightRect.left - 8}px ${highlightRect.top - 8}px, 
                                ${highlightRect.right + 8}px ${highlightRect.top - 8}px, 
                                ${highlightRect.right + 8}px ${highlightRect.bottom + 8}px, 
                                ${highlightRect.left - 8}px ${highlightRect.bottom + 8}px, 
                                ${highlightRect.left - 8}px 100%, 
                                100% 100%, 100% 0%
                            )`
                        } : { clipPath: 'none' }
                    } />

                    {/* Highlights Ring */}
                    {highlightRect && (
                        <div className="absolute border-2 border-indigo-400 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 animate-pulse pointer-events-none"
                            style={{
                                top: highlightRect.top - 8,
                                left: highlightRect.left - 8,
                                width: highlightRect.width + 16,
                                height: highlightRect.height + 16
                            }}
                        />
                    )}

                    {/* Dialog Box */}
                    <div className="student-tour-dialog absolute transition-all duration-500 max-w-sm w-full bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto"
                        style={
                            highlightRect ? {
                                top: highlightRect.top + highlightRect.height / 2,
                                left: highlightRect.right + 24, // Place to the right of the highlight
                                transform: 'translateY(-50%)',
                            } : {
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                            }
                        }>
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-indigo-50 rounded-xl">
                                <div className="text-indigo-600 [&>svg]:w-6 [&>svg]:h-6">{currentTourStep.icon}</div>
                            </div>
                            <div className="flex-1 mt-1">
                                <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{currentTourStep.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{currentTourStep.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                            <div className="flex gap-1.5">
                                {TOUR_STEPS.map((_: any, i: number) => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all ${i === tourStep ? 'w-4 bg-indigo-600' : 'w-1.5 bg-slate-200'}`} />
                                ))}
                            </div>
                            <button onClick={handleTourNext} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-lg transition-colors shadow-md shadow-indigo-500/20">
                                {tourStep === TOUR_STEPS.length - 1 ? "Let's Go!" : "Next"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export function StudentInContentOverlays({ p }: { p: any }) {
    const {
        showRatingModal,
        setShowRatingModal,
        ratingForm,
        setRatingForm,
        personalInfo,
        submitRating,
        showTimeInModal,
        setShowTimeInModal,
        visitReasons,
        selectedReason,
        setSelectedReason,
        submitTimeIn,
        toast
    } = p;

    return (
        <>
            {/* PARTICIPANT'S EVALUATION FORM MODAL */}
            {showRatingModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop" onClick={() => setShowRatingModal(false)} />
                    <div className="student-modal-surface relative bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scale-in">
                        {/* Header */}
                        <div className="px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-800 text-white flex-shrink-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-blue-200 mb-1">Negros Oriental State University — CARE Center</p>
                                    <h3 className="text-lg font-extrabold tracking-tight">PARTICIPANT'S EVALUATION FORM</h3>
                                    <p className="text-xs text-blue-200 mt-1 font-medium">{ratingForm.title}</p>
                                </div>
                                <button onClick={() => setShowRatingModal(false)} className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all flex-shrink-0 text-lg">✕</button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Student Info Strip */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Name</label><p className="text-sm font-bold text-gray-800">{personalInfo.firstName} {personalInfo.lastName}</p></div>
                                <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Sex</label><p className="text-sm font-bold text-gray-800">{personalInfo.sex || personalInfo.gender || '—'}</p></div>
                                <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">College / Campus</label><p className="text-sm font-bold text-gray-800">{personalInfo.department || '—'}</p><p className="text-[10px] text-gray-500">{personalInfo.course} - {personalInfo.year}</p></div>
                                <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Date of Activity</label><p className="text-sm font-bold text-gray-800">{ratingForm.date_of_activity ? new Date(ratingForm.date_of_activity).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p></div>
                            </div>

                            {/* Evaluation Criteria */}
                            <div>
                                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-4">Evaluation Criteria</h4>
                                <p className="text-[10px] text-gray-500 mb-4">Please rate each item: <span className="font-bold">1</span> = Poor, <span className="font-bold">2</span> = Below Average, <span className="font-bold">3</span> = Average, <span className="font-bold">4</span> = Above Average, <span className="font-bold">5</span> = Excellent</p>
                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-[1fr_repeat(5,48px)] bg-gray-50 border-b border-gray-200">
                                        <div className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Criteria</div>
                                        {['1', '2', '3', '4', '5'].map(n => <div key={n} className="flex items-center justify-center text-[10px] font-bold text-gray-500">{n}</div>)}
                                    </div>
                                    {/* Criteria Rows */}
                                    {[
                                        { key: 'q1', label: 'Relevance of the activity to the needs/problems of the clientele' },
                                        { key: 'q2', label: 'Quality of the activity' },
                                        { key: 'q3', label: 'Timeliness' },
                                        { key: 'q4', label: 'Management of the activity' },
                                        { key: 'q5', label: 'Overall organization of the activity' },
                                        { key: 'q6', label: 'Overall assessment of the activity' },
                                        { key: 'q7', label: 'Skills/competence of the facilitator/s' }
                                    ].map((item, idx) => (
                                        <div key={item.key} className={`grid grid-cols-[1fr_repeat(5,48px)] ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} border-b border-gray-100 last:border-0 hover:bg-blue-50/30 transition-colors`}>
                                            <div className="px-4 py-3 text-xs text-gray-700 flex items-center"><span className="font-bold text-gray-500 mr-2">{idx + 1}.</span>{item.label}</div>
                                            {[1, 2, 3, 4, 5].map(val => (
                                                <div key={val} className="flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setRatingForm({ ...ratingForm, [item.key]: val })}
                                                        className={`w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${ratingForm[item.key] === val ? 'border-blue-600 bg-blue-600 scale-110 shadow-lg shadow-blue-500/30' : 'border-gray-300 hover:border-blue-400 hover:scale-105'}`}
                                                    >
                                                        {ratingForm[item.key] === val && <div className="w-2 h-2 bg-white rounded-full" />}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Open-ended Questions */}
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">What I like best about the activity:</label>
                                    <textarea rows={3} value={ratingForm.open_best} onChange={e => setRatingForm({ ...ratingForm, open_best: e.target.value })} className="w-full bg-blue-50/40 border border-blue-100 rounded-xl p-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none" placeholder="Share what you enjoyed most..."></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">My suggestions to further improve the activity:</label>
                                    <textarea rows={3} value={ratingForm.open_suggestions} onChange={e => setRatingForm({ ...ratingForm, open_suggestions: e.target.value })} className="w-full bg-blue-50/40 border border-blue-100 rounded-xl p-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none" placeholder="What could be improved..."></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Other comments:</label>
                                    <textarea rows={3} value={ratingForm.open_comments} onChange={e => setRatingForm({ ...ratingForm, open_comments: e.target.value })} className="w-full bg-blue-50/40 border border-blue-100 rounded-xl p-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none" placeholder="Any other feedback..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0 flex gap-3">
                            <button onClick={submitRating} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">Submit Evaluation</button>
                            <button onClick={() => setShowRatingModal(false)} className="px-6 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
                , document.body)}
            {/* TIME IN MODAL */}
            {showTimeInModal && (<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"><div className="student-modal-surface bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl"><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">Office Visit</h3><button onClick={() => setShowTimeInModal(false)} className="text-gray-400 text-xl">✕</button></div><p className="text-sm text-gray-500 mb-4">Please select the reason for your visit:</p><div className="space-y-2 mb-6 max-h-60 overflow-y-auto">{visitReasons.map((r: any) => (<label key={r.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedReason === r.reason ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}><input type="radio" name="reason" value={r.reason} onChange={e => setSelectedReason(e.target.value)} className="w-4 h-4 text-blue-600" /><span className="text-sm font-medium text-gray-700">{r.reason}</span></label>))}</div><button onClick={submitTimeIn} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700">Confirm Time In</button></div></div>)}
            {/* TOAST */}
            {toast && (<div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl text-white flex items-center gap-3 animate-slide-in-right z-50 backdrop-blur-sm ${toast.type === 'error' ? 'bg-red-600/90' : 'bg-gradient-to-r from-emerald-500 to-green-600'}`}><div className="text-xl">{toast.type === 'error' ? '⚠️' : '✅'}</div><div><p className="font-bold text-sm">{toast.type === 'error' ? 'Error' : 'Success'}</p><p className="text-xs opacity-90">{toast.message}</p></div></div>)}
        </>
    );
}

export function StudentFloatingHub({ p }: { p: any }) {
    const { showCommandHub, setShowCommandHub, setActiveView, setShowCounselingForm, setShowSupportModal, Icons } = p;

    return (
        createPortal(
            <>
                {/* FLOATING CHAT BUTTON */}
                {!showCommandHub && (
                    <button onClick={() => setShowCommandHub(true)} className="student-hub-trigger fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-500 to-sky-400 rounded-full shadow-2xl shadow-blue-500/30 flex items-center justify-center text-white text-xl hover:scale-110 hover:shadow-blue-500/40 transition-all animate-float z-[10010] group">
                        <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-4.7 8.38 8.38 0 0 1 3.8.9L21 9z"></path></svg>
                    </button>
                )}

                {/* STUDENT COMMAND HUB */}
                {showCommandHub && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10020] flex items-center justify-center p-4 animate-backdrop" onClick={() => setShowCommandHub(false)}>
                        <div className="student-command-hub bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in border border-white/20" onClick={e => e.stopPropagation()}>
                            <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/20 rounded-full -mr-10 -mt-10 blur-2xl animate-float"></div>
                                <h3 className="text-xl font-extrabold relative z-10">Student Hub</h3>
                                <p className="text-blue-200 text-xs relative z-10">Quick access to student services</p>
                                <button onClick={() => setShowCommandHub(false)} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors bg-white/10 p-1 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                            </div>
                            <div className="p-4 grid grid-cols-2 gap-3">
                                <button onClick={() => { setShowCommandHub(false); setActiveView('counseling'); setShowCounselingForm(true); }} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-100 transition-all group">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform"><Icons.Counseling /></div>
                                    <span className="text-xs font-bold text-gray-700">Counseling</span>
                                </button>
                                <button onClick={() => { setShowCommandHub(false); setActiveView('support'); setShowSupportModal(true); }} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all group">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform"><Icons.Support /></div>
                                    <span className="text-xs font-bold text-gray-700">Support</span>
                                </button>
                                <button onClick={() => { setShowCommandHub(false); setActiveView('feedback'); }} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-100 transition-all group">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform"><Icons.Feedback /></div>
                                    <span className="text-xs font-bold text-gray-700">Feedback</span>
                                </button>
                                <button onClick={() => { setShowCommandHub(false); setActiveView('scholarship'); }} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-all group">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform"><Icons.Scholarship /></div>
                                    <span className="text-xs font-bold text-gray-700">Scholarships</span>
                                </button>
                            </div>
                            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                                <button onClick={() => { setShowCommandHub(false); setActiveView('profile'); }} className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                                    <Icons.Profile /> View My Profile
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>,
            document.body
        )
    );
}
