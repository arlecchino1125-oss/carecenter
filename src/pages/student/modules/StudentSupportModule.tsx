import React from 'react';
import { createPortal } from 'react-dom';
import ServiceIntroModal from './ServiceIntroModal';

export default function StudentSupportModule({ p }: { p: any }) {
    const { activeView, supportRequests, setShowSupportRequestsModal, showSupportRequestsModal, showSupportModal, setShowSupportModal, personalInfo, supportForm, setSupportForm, submitSupportRequest, isSubmitting, formatFullDate, Icons } = p;

    return (
        <>            {activeView === 'support' && <ServiceIntroModal serviceKey="support" />}
            {activeView === 'support' && (
                <div className="student-module student-support-module max-w-6xl mx-auto space-y-6 page-transition">
                    {/* Header with Your Requests button */}
                    <div className="flex justify-between items-start animate-fade-in-up">
                        <div><h2 className="text-2xl font-extrabold mb-1 text-gray-800">Additional Support</h2><p className="text-sm text-gray-400">For students with disabilities or special needs</p></div>
                        <button onClick={() => setShowSupportRequestsModal(true)} className="student-surface-card relative flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-purple-100/50 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-purple-50 transition-all shadow-sm btn-press">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            Your Requests
                            {supportRequests.length > 0 && <span className="bg-teal-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{supportRequests.length}</span>}
                        </button>
                    </div>
                    {/* Introduction Text */}
                    <div className="student-surface-card bg-white/90 backdrop-blur-sm rounded-xl border border-blue-100/50 p-8 shadow-sm animate-fade-in-up">
                        <div className="text-center mb-8 border-b border-purple-100/50 pb-6">
                            <h2 className="font-bold text-xl text-gray-900">NEGROS ORIENTAL STATE UNIVERSITY</h2>
                            <p className="text-sm text-gray-500">Office of the Campus Student Affairs and Services</p>
                            <p className="text-sm text-gray-500">Guihulngan Campus</p>
                            <h3 className="font-extrabold text-lg mt-4 bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">FORM FOR STUDENTS WHO REQUIRE ADDITIONAL SUPPORT</h3>
                        </div>
                        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
                            <section><h4 className="font-bold text-gray-900 mb-2">1. We welcome your application</h4><p>We welcome applications from students with disabilities or special learning needs. By completing this form, you help us to form a clearer picture of your needs, which will enable us to see how we could support you, should you be admitted.</p><p className="mt-2">As in the case of all other applicants, first of all we consider your academic merits and whether you comply with the admission criteria for the program that you want to apply for. Then we will consider what is reasonable and practical for the specific program to which you have applied.</p></section>
                            <section><h4 className="font-bold text-gray-900 mb-2">2. We protect your information</h4><p>We will respect your privacy and keep your information confidential. However, we have to share relevant information with key academic, administrative and support staff members. They need such information to determine how we might best support you, should you be admitted for studies at NORSU–Guihulngan Campus.</p></section>
                            <section><h4 className="font-bold text-gray-900 mb-2">3. Submit this form, along with the supporting documents, to your application profile</h4><p>Please submit the completed form and all supporting documents (e.g. any copies of medical or psychological proof of your condition and/or disability) when you apply. We must receive all your documents by the closing date for applications. We cannot process your application unless we have all the necessary information.</p></section>
                            <section><h4 className="font-bold text-gray-900 mb-2">4. Should you need assistance or information</h4><p>Contact the Student Affairs and Services Office to learn about the kind of support the University offers.</p></section>
                            <section><h4 className="font-bold text-gray-900 mb-2">5. When you arrive on campus</h4><p>We present an orientation session for students with disabilities and special needs every year. It takes place at the first month of the academic year, as part of the orientation program for newcomer students.</p></section>
                            <section><h4 className="font-bold text-gray-900 mb-2">6. How can we reach you?</h4><p>When we receive your form, we send it to the faculty to which you are applying so that they can determine whether they can support you. The personal information you provide here also allows us to locate your application swiftly.</p></section>
                        </div>
                        <div className="mt-8 pt-6 border-t border-purple-100/50 flex justify-center">
                            <button onClick={() => setShowSupportModal(true)} className="bg-gradient-to-r from-blue-500 to-sky-400 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-400 hover:to-sky-300 transition shadow-lg shadow-blue-500/20 flex items-center gap-2 btn-press">
                                Proceed to Application Form <Icons.ArrowRight />
                            </button>
                        </div>
                    </div>

                    {/* Support Requests Modal */}
                    {showSupportRequestsModal && createPortal(
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50" onClick={() => setShowSupportRequestsModal(false)}>
                            <div className="student-modal-surface bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
                                <div className="px-6 py-5 bg-gradient-to-r from-teal-600 to-emerald-700 text-white flex-shrink-0">
                                    <div className="flex justify-between items-center">
                                        <div><h3 className="text-lg font-extrabold">Your Support Requests</h3><p className="text-xs text-teal-200 mt-0.5">{supportRequests.length} total request{supportRequests.length !== 1 ? 's' : ''}</p></div>
                                        <button onClick={() => setShowSupportRequestsModal(false)} className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-lg">✕</button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {supportRequests.length === 0 ? (
                                        <div className="text-center py-12"><p className="text-gray-400 text-sm">No requests found.</p></div>
                                    ) : supportRequests.map((req: any, idx: number) => (
                                        <div key={req.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-teal-200 transition-all" style={{ animationDelay: `${idx * 60}ms` }}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-bold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg">{req.support_type}</span>
                                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${req.status === 'Completed' ? 'bg-green-100 text-green-700' : req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{req.status}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400">{formatFullDate(new Date(req.created_at))}</p>
                                            {req.resolution_notes && <div className="mt-2 p-2.5 bg-green-50 border border-green-100 rounded-lg"><p className="text-[10px] font-bold text-green-800 uppercase">Resolution</p><p className="text-xs text-green-900 mt-0.5">{req.resolution_notes}</p></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        , document.body)}

                    {showSupportModal && createPortal(
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="student-modal-surface bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-purple-100/50 animate-fade-in-up">
                                <div className="flex justify-between items-center p-6 border-b shrink-0">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">FORM FOR STUDENTS WHO REQUIRE ADDITIONAL SUPPORT</h3>
                                        <p className="text-xs text-gray-500">Guihulngan Campus</p>
                                    </div>
                                    <button onClick={() => setShowSupportModal(false)} className="text-gray-400 text-xl hover:text-gray-600">✕</button>
                                </div>

                                <div className="p-6 overflow-y-auto space-y-8">
                                    {/* Student Info */}
                                    <section className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-sm text-blue-800 mb-4 uppercase tracking-wider">Student Information</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div><label className="block text-xs font-bold text-gray-500">Full Name</label><div className="font-semibold">{personalInfo.firstName} {personalInfo.lastName}</div></div>
                                            <div><label className="block text-xs font-bold text-gray-500">Date Filed</label><div className="font-semibold">{new Date().toLocaleDateString()}</div></div>
                                            <div><label className="block text-xs font-bold text-gray-500">Date of Birth</label><div className="font-semibold">{personalInfo.dob}</div></div>
                                            <div><label className="block text-xs font-bold text-gray-500">Program – Year Level</label><div className="font-semibold">{personalInfo.course} - {personalInfo.year}</div></div>
                                            <div><label className="block text-xs font-bold text-gray-500">Cell Phone Number</label><div className="font-semibold">{personalInfo.mobile}</div></div>
                                            <div><label className="block text-xs font-bold text-gray-500">Email Address</label><div className="font-semibold">{personalInfo.email}</div></div>
                                            <div className="col-span-2"><label className="block text-xs font-bold text-gray-500">Home Address</label><div className="font-semibold">{personalInfo.address}</div></div>
                                        </div>
                                    </section>

                                    {/* Category */}
                                    <section>
                                        <h4 className="font-bold text-sm text-blue-800 mb-4 uppercase tracking-wider">Category (Check all that apply)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {['Persons with Disabilities (PWDs)', 'Indigenous Peoples (IPs) & Cultural Communities', 'Working Students', 'Economically Challenged Students', 'Students with Special Learning Needs', 'Rebel Returnees', 'Orphans', 'Senior Citizens', 'Homeless Students', 'Solo Parenting', 'Pregnant Women', 'Women in Especially Difficult Circumstances'].map(cat => (
                                                <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"><input type="checkbox" checked={supportForm.categories.includes(cat)} onChange={(e) => { const newCats = e.target.checked ? [...supportForm.categories, cat] : supportForm.categories.filter((c: any) => c !== cat); setSupportForm({ ...supportForm, categories: newCats }); }} className="w-4 h-4 text-blue-600 rounded" /> {cat}</label>
                                            ))}
                                            <div className="col-span-2 flex items-center gap-2 mt-2">
                                                <input type="checkbox" checked={!!supportForm.otherCategory} readOnly className="w-4 h-4 text-blue-600 rounded" />
                                                <span className="text-sm">Others, specify:</span>
                                                <input value={supportForm.otherCategory} onChange={e => setSupportForm({ ...supportForm, otherCategory: e.target.value })} className="border-b border-gray-300 focus:border-blue-600 outline-none px-2 py-1 text-sm flex-1 bg-transparent" />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Section A */}
                                    <section>
                                        <h4 className="font-bold text-sm text-blue-800 mb-4 uppercase tracking-wider">A. Your Studies</h4>
                                        <p className="text-xs text-gray-500 mb-3">Which program(s) did you apply for? (Auto-filled)</p>
                                        <div className="space-y-3">
                                            <div><label className="block text-xs font-bold text-gray-500">1st Priority</label><input disabled value={personalInfo.priorityCourse} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700" /></div>
                                            <div><label className="block text-xs font-bold text-gray-500">2nd Priority</label><input disabled value={personalInfo.altCourse1} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700" /></div>
                                            <div><label className="block text-xs font-bold text-gray-500">3rd Priority</label><input disabled value={personalInfo.altCourse2} className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700" /></div>
                                        </div>
                                    </section>

                                    {/* Section B */}
                                    <section>
                                        <h4 className="font-bold text-sm text-blue-800 mb-2 uppercase tracking-wider">B. Particulars of your disability or special learning need</h4>
                                        <p className="text-xs text-gray-500 mb-4 italic">We would like to gain a better understanding of the kind of support that you may need. However, we might not be able to assist in all the ways that you require, but it might help us with our planning in future.</p>
                                        <div className="space-y-4">
                                            <div><label className="block text-xs font-bold text-gray-700 mb-1">1. Upon application, you indicated that you have a disability or special learning need. Please describe it briefly.</label><textarea rows={2} value={supportForm.q1} onChange={e => setSupportForm({ ...supportForm, q1: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"></textarea></div>
                                            <div><label className="block text-xs font-bold text-gray-700 mb-1">2. What kind of support did you receive at your previous school?</label><textarea rows={2} value={supportForm.q2} onChange={e => setSupportForm({ ...supportForm, q2: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"></textarea></div>
                                            <div><label className="block text-xs font-bold text-gray-700 mb-1">3. What support or assistance do you require from NORSU–Guihulngan Campus to enable you to fully participate in campus activities...?</label><textarea rows={3} value={supportForm.q3} onChange={e => setSupportForm({ ...supportForm, q3: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"></textarea></div>
                                            <div><label className="block text-xs font-bold text-gray-700 mb-1">4. Indicate and elaborate on any other special needs or assistance that may be required:</label><textarea rows={2} value={supportForm.q4} onChange={e => setSupportForm({ ...supportForm, q4: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"></textarea></div>
                                        </div>
                                    </section>

                                    <div className="mb-6"><label className="block text-xs font-bold text-gray-700 mb-1">Upload Supporting Documents (Medical/Psychological Proof)</label><input type="file" onChange={(e: any) => setSupportForm({ ...supportForm, file: e.target.files[0] })} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" /></div>
                                </div>

                                <div className="flex gap-3 p-6 border-t border-purple-100/50 shrink-0">
                                    <button onClick={submitSupportRequest} disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-blue-500 to-sky-400 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 btn-press transition-all">{isSubmitting ? 'Submitting...' : 'Submit Application'}</button>
                                    <button onClick={() => setShowSupportModal(false)} className="px-8 py-3 bg-white/80 border border-purple-100/50 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">Cancel</button>
                                </div>
                            </div>
                        </div>
                        , document.body)}
                </div>
            )}        </>
    );
}

