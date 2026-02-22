import React from 'react';
import { createPortal } from 'react-dom';
import ServiceIntroModal from './ServiceIntroModal';

export default function StudentAssessmentModule({ p }: { p: any }) {
    const { activeView, loadingForm, formsList, completedForms, openAssessmentForm, Icons, showAssessmentModal, activeForm, setShowAssessmentModal, formQuestions, assessmentForm, handleInventoryChange, submitAssessment, isSubmitting, showSuccessModal, setShowSuccessModal } = p;

    return (
        <>            {activeView === 'assessment' && <ServiceIntroModal serviceKey="assessment" />}
            {activeView === 'assessment' && (
                <div className="student-module student-assessment-module max-w-5xl mx-auto page-transition">
                    <h2 className="text-2xl font-extrabold mb-1 text-gray-800 animate-fade-in-up">Needs Assessment Tool</h2>
                    <p className="text-sm text-gray-400 mb-8 animate-fade-in-up">Complete the inventory to help us understand your needs and provide better support.</p>
                    {loadingForm ? <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div><p className="ml-3 text-gray-400 text-sm">Loading forms...</p></div> : formsList.length === 0 ? (
                        <div className="student-surface-card bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100/50 p-12 shadow-sm text-center card-hover animate-fade-in-up">
                            <div className="text-5xl mb-4">📋</div>
                            <p className="text-gray-500 font-medium">No assessment forms are currently available.</p>
                            <p className="text-xs text-gray-400 mt-1">Check back later for new assessments from the care staff.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {formsList.map((form: any, idx: number) => {
                                const isDone = completedForms.has(form.id);
                                return (
                                    <button key={form.id} onClick={() => openAssessmentForm(form)} disabled={isDone} className={`student-surface-card bg-white/90 backdrop-blur-sm rounded-2xl border p-6 shadow-sm transition-all text-left group animate-fade-in-up ${isDone ? 'border-gray-200 opacity-60 cursor-not-allowed' : 'border-blue-100/50 hover:shadow-lg hover:border-blue-200 cursor-pointer card-hover'}`} style={{ animationDelay: `${idx * 80}ms` }}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${isDone ? 'bg-gray-400 shadow-gray-400/20' : 'bg-gradient-to-br from-blue-500 to-sky-400 shadow-blue-500/20'}`}><Icons.Assessment /></div>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isDone ? 'text-gray-500 bg-gray-100' : 'text-emerald-600 bg-emerald-50'}`}>{isDone ? '✓ Completed' : 'Active'}</span>
                                        </div>
                                        <h3 className={`font-bold text-sm mb-1 transition-colors ${isDone ? 'text-gray-500' : 'text-gray-900 group-hover:text-blue-600'}`}>{form.title}</h3>
                                        <p className="text-xs text-gray-400 line-clamp-2 mb-3">{form.description || 'Click to view and complete this assessment.'}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                            <span>📅 {new Date(form.created_at).toLocaleDateString()}</span>
                                        </div>
                                        {!isDone && <div className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Start Assessment →</div>}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* ASSESSMENT FORM MODAL */}
                    {showAssessmentModal && activeForm && createPortal(
                        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                            {/* Backdrop */}
                            <div className="animate-backdrop" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }} onClick={() => setShowAssessmentModal(false)} />

                            {/* Modal */}
                            <div className="student-modal-surface animate-scale-in" style={{ position: 'relative', width: '100%', maxWidth: '640px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '20px', boxShadow: '0 25px 60px rgba(0,0,0,0.25)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

                                {/* Header */}
                                <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #4338ca 100%)', color: '#fff', flexShrink: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>{activeForm.title}</h3>
                                            <p style={{ fontSize: '12px', opacity: 0.75, marginTop: '4px', lineHeight: 1.4 }}>{activeForm.description || 'Please answer all questions honestly.'}</p>
                                            {formQuestions.length > 0 && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                                                    <div style={{ flex: 1, maxWidth: '180px', height: '5px', background: 'rgba(255,255,255,0.2)', borderRadius: '99px', overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${Math.round((Object.keys(assessmentForm.responses).length / formQuestions.length) * 100)}%`, background: 'linear-gradient(90deg, #7dd3fc, #6ee7b7)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
                                                    </div>
                                                    <span style={{ fontSize: '10px', fontWeight: 700, opacity: 0.7 }}>{Object.keys(assessmentForm.responses).length}/{formQuestions.length}</span>
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => setShowAssessmentModal(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '18px' }}>✕</button>
                                    </div>
                                </div>

                                {/* Body */}
                                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc' }}>
                                    {formQuestions.length === 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '200px', textAlign: 'center' }}>
                                            <div className="animate-spin" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #dbeafe', borderTopColor: '#3b82f6', marginBottom: '16px' }} />
                                            <p style={{ color: '#6b7280', fontWeight: 600, fontSize: '14px' }}>Loading questions...</p>
                                            <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>Please wait while we prepare your assessment.</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {formQuestions.map((q: any, idx: number) => (
                                                <div key={q.id} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: `1.5px solid ${assessmentForm.responses[q.id] !== undefined ? '#93c5fd' : '#e5e7eb'}`, boxShadow: assessmentForm.responses[q.id] !== undefined ? '0 2px 8px rgba(59,130,246,0.08)' : '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.25s ease' }}>
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                                                        <span style={{ width: '26px', height: '26px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0, background: assessmentForm.responses[q.id] !== undefined ? '#3b82f6' : '#e5e7eb', color: assessmentForm.responses[q.id] !== undefined ? '#fff' : '#9ca3af', transition: 'all 0.25s ease' }}>{idx + 1}</span>
                                                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', lineHeight: 1.6, margin: 0, paddingTop: '2px' }}>{q.question_text}</p>
                                                    </div>
                                                    {q.question_type === 'text' || q.question_type === 'open_ended' ? (
                                                        <div style={{ marginLeft: '38px' }}>
                                                            <textarea style={{ width: '100%', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '12px', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box' }} rows={2} placeholder="Type your answer here..." value={assessmentForm.responses[q.id] || ''} onChange={e => handleInventoryChange(q.id, e.target.value)} />
                                                        </div>
                                                    ) : (
                                                        <div style={{ marginLeft: '38px' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
                                                                {[1, 2, 3, 4, 5].map(v => (
                                                                    <button key={v} onClick={() => handleInventoryChange(q.id, v)} style={{ flex: 1, height: '44px', borderRadius: '10px', border: `2px solid ${assessmentForm.responses[q.id] === v ? '#3b82f6' : '#e5e7eb'}`, background: assessmentForm.responses[q.id] === v ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#fff', color: assessmentForm.responses[q.id] === v ? '#fff' : '#6b7280', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease', transform: assessmentForm.responses[q.id] === v ? 'scale(1.05)' : 'scale(1)', boxShadow: assessmentForm.responses[q.id] === v ? '0 4px 12px rgba(59,130,246,0.3)' : 'none' }}>{v}</button>
                                                                ))}
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                                                                <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 500 }}>Strongly Disagree</span>
                                                                <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 500 }}>Strongly Agree</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', background: '#fff', flexShrink: 0 }}>
                                    <button onClick={submitAssessment} disabled={isSubmitting || formQuestions.length === 0} className="btn-press" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: isSubmitting || formQuestions.length === 0 ? '#cbd5e1' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: isSubmitting || formQuestions.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: isSubmitting || formQuestions.length === 0 ? 'none' : '0 4px 14px rgba(37,99,235,0.3)', transition: 'all 0.25s ease' }}>
                                        {isSubmitting ? (
                                            <><div className="animate-spin" style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Submitting...</>
                                        ) : (
                                            <><svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg> Submit Assessment</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                        , document.body)}

                    {/* SUCCESS MODAL */}
                    {showSuccessModal && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="student-modal-surface bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-sm p-8 shadow-2xl text-center border border-purple-100/50 animate-fade-in-up">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Assessment Submitted!</h3>
                                <p className="text-sm text-gray-500 mb-6">Thank you for completing the assessment. Your responses have been recorded and will be used to provide you with better support.</p>
                                <button onClick={() => setShowSuccessModal(false)} className="w-full bg-gradient-to-r from-blue-500 to-sky-400 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 btn-press transition-all">Done</button>
                            </div>
                        </div>
                    )}
                </div>
            )}        </>
    );
}

