import React from 'react';
import ServiceIntroModal from './ServiceIntroModal';

export default function StudentProfileModule({ p }: { p: any }) {
    const { activeView } = p;

    return (
        <>
            {activeView === 'profile' && <ServiceIntroModal serviceKey="profile" />}
            {activeView === 'profile' && renderProfileView(p)}
        </>
    );
}
function renderProfileView(p: any) {
    const { profileTab, setProfileTab, personalInfo, isEditing, setIsEditing, setPersonalInfo, saveProfileChanges, Icons, attendanceMap, formatFullDate, showMoreProfile, setShowMoreProfile } = p;
    // Helper to render a field row
    const Field = ({ label, field, type, options, readOnly, colSpan }: any) => (
        <div className={colSpan ? `col-span-${colSpan}` : ''}>
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">{label}</p>
            {isEditing && !readOnly ? (
                type === 'select' ? (
                    <select className="w-full bg-gray-50 border border-slate-200 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400/30" value={personalInfo[field] || ''} onChange={(e) => setPersonalInfo({ ...personalInfo, [field]: e.target.value })}>
                        <option value="">Select</option>
                        {(options || []).map((o: any) => <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>{typeof o === 'string' ? o : o.label}</option>)}
                    </select>
                ) : type === 'textarea' ? (
                    <textarea className="w-full bg-gray-50 border border-slate-200 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400/30 resize-none" rows={3} value={personalInfo[field] || ''} onChange={(e) => setPersonalInfo({ ...personalInfo, [field]: e.target.value })} />
                ) : type === 'boolean' ? (
                    <select className="w-full bg-gray-50 border border-slate-200 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400/30" value={personalInfo[field] ? 'Yes' : 'No'} onChange={(e) => setPersonalInfo({ ...personalInfo, [field]: e.target.value === 'Yes' })}>
                        <option value="No">No</option><option value="Yes">Yes</option>
                    </select>
                ) : (
                    <input type={type || 'text'} className="w-full bg-gray-50 border border-slate-200 p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400/30" value={personalInfo[field] || ''} onChange={(e) => {
                        if (field === 'dob') {
                            const dob = e.target.value;
                            let age = personalInfo.age;
                            if (dob) { const b = new Date(dob); const t = new Date(); let a = t.getFullYear() - b.getFullYear(); const m = t.getMonth() - b.getMonth(); if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--; age = a >= 0 ? a : ''; }
                            setPersonalInfo({ ...personalInfo, dob, age });
                        } else {
                            setPersonalInfo({ ...personalInfo, [field]: e.target.value });
                        }
                    }} />
                )
            ) : (
                <p className="text-sm font-semibold text-slate-700 truncate" title={String(personalInfo[field] || '')}>
                    {type === 'boolean' ? (personalInfo[field] ? 'Yes' : 'No') : (personalInfo[field] || <span className="text-gray-300 italic font-normal">—</span>)}
                </p>
            )}
        </div>
    );
    // Section card wrapper
    const Section = ({ icon, gradient, title, children }: any) => (
        <div className="student-surface-card bg-white/90 backdrop-blur-sm rounded-xl border border-blue-100/50 p-6 shadow-sm card-hover">
            <h4 className="font-bold text-sm mb-4 flex items-center gap-2"><span className={`p-1.5 bg-gradient-to-br ${gradient} text-white rounded-lg text-xs`}>{icon}</span> {title}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">{children}</div>
        </div>
    );

    return (
        <div className="student-module student-profile-module flex gap-8 page-transition">
            <div className="w-80 shrink-0 space-y-6 animate-fade-in-up">
                <div className="student-profile-hero bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 text-white text-center relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/20 rounded-full -mr-10 -mt-10 blur-2xl animate-float"></div>
                    <div className="h-24 bg-white/5 relative"></div>
                    <div className="px-8 pb-8 -mt-12 relative z-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-sky-400 rounded-2xl mx-auto shadow-xl shadow-blue-500/30 flex items-center justify-center text-4xl font-black text-white border-4 border-white/20 mb-4">{personalInfo.firstName?.[0] || 'S'}</div>
                        <h3 className="text-xl font-extrabold">{personalInfo.firstName} {personalInfo.lastName} {personalInfo.suffix}</h3>
                        <p className="text-xs text-blue-200/50 font-medium">{personalInfo.studentId}</p>
                        <div className="flex justify-center gap-2 mt-4">
                            <span className="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold">{personalInfo.year}</span>
                            {personalInfo.section && <span className="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold">Sec {personalInfo.section}</span>}
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-bold">{personalInfo.status}</span>
                        </div>
                        <button onClick={() => { setProfileTab('personal'); setIsEditing(true); }} className="w-full mt-8 bg-white/15 backdrop-blur-sm text-white py-2.5 rounded-xl text-xs font-bold hover:bg-white/25 transition-all border border-white/20 btn-press">Edit Profile</button>
                    </div>
                </div>
                <div className="student-surface-card bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100/50 p-6 shadow-sm card-hover" style={{ animationDelay: '100ms' }}>
                    <h4 className="text-[10px] font-bold text-purple-400/60 uppercase tracking-widest mb-4">Academic Summary</h4>
                    <p className="text-[10px] text-gray-400">Department</p>
                    <p className="text-sm font-bold mb-4">{personalInfo.department}</p>
                    <p className="text-[10px] text-gray-400">Course</p>
                    <p className="text-sm font-bold mb-4">{personalInfo.course}</p>
                    <p className="text-[10px] text-gray-400">Year Level</p>
                    <p className="text-sm font-bold mb-4">{personalInfo.year || '-'}</p>
                    <p className="text-[10px] text-gray-400">Section</p>
                    <p className="text-sm font-bold">{personalInfo.section || '-'}</p>
                </div>
            </div>
            <div className="flex-1 space-y-6">
                <div className="student-surface-card bg-white/90 backdrop-blur-sm rounded-xl border border-blue-100/50 flex shadow-sm p-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    {[{ id: 'personal', label: 'Personal Info', icon: <Icons.Profile /> }, { id: 'engagement', label: 'Engagement History', icon: <Icons.Clock /> }, { id: 'security', label: 'Security', icon: <Icons.Support /> }].map((tab: any) => (
                        <button key={tab.id} onClick={() => { setProfileTab(tab.id); setIsEditing(false); }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${profileTab === tab.id ? 'bg-gradient-to-r from-blue-500 to-sky-400 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-gray-900 hover:bg-purple-50'}`}>{tab.icon} {tab.label}</button>
                    ))}
                </div>
                {profileTab === 'personal' && (
                    <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>

                        {/* BASIC INFORMATION */}
                        <Section icon={<Icons.Profile />} gradient="from-blue-500 to-sky-400" title="Basic Information">
                            <Field label="Last Name" field="lastName" />
                            <Field label="First Name" field="firstName" />
                            <Field label="Middle Name" field="middleName" />
                            <Field label="Suffix" field="suffix" />
                            <Field label="Date of Birth" field="dob" type="date" />
                            <Field label="Age" field="age" readOnly />
                            <Field label="Sex (Birth)" field="sex" type="select" options={['Male', 'Female']} />
                            <Field label="Gender Identity" field="genderIdentity" type="select" options={['Cis-gender', 'Transgender', 'Non-binary', 'Prefer not to say']} />
                            <Field label="Civil Status" field="civilStatus" type="select" options={['Single', 'Married', 'Separated Legally', 'Separated Physically', 'With Live-In Partner', 'Divorced', 'Widow/er']} />
                            <Field label="Nationality" field="nationality" />
                            <Field label="Religion" field="religion" />
                            <Field label="Place of Birth" field="placeOfBirth" />
                        </Section>

                        {/* CONTACT & ADDRESS */}
                        <Section icon={<Icons.Events />} gradient="from-emerald-400 to-teal-500" title="Contact & Address">
                            <Field label="Email" field="email" colSpan={2} />
                            <Field label="Mobile" field="mobile" />
                            <Field label="Facebook" field="facebookUrl" />
                            <Field label="Street / Barangay" field="street" colSpan={2} />
                            <Field label="City / Municipality" field="city" />
                            <Field label="Province" field="province" />
                            <Field label="Zip Code" field="zipCode" />
                            <Field label="Current Residence" field="address" />
                        </Section>

                        {/* FAMILY BACKGROUND */}
                        <Section icon="👨‍👩‍👧" gradient="from-amber-400 to-orange-500" title="Family Background">
                            <Field label="Mother's Name" field="motherName" />
                            <Field label="Occupation" field="motherOccupation" />
                            <Field label="Contact" field="motherContact" colSpan={2} />
                            <Field label="Father's Name" field="fatherName" />
                            <Field label="Occupation" field="fatherOccupation" />
                            <Field label="Contact" field="fatherContact" colSpan={2} />
                            <Field label="Parent's Address" field="parentAddress" colSpan={2} />
                            <Field label="No. of Brothers" field="numBrothers" />
                            <Field label="No. of Sisters" field="numSisters" />
                            <Field label="Birth Order" field="birthOrder" type="select" options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Only child', 'Legally adopted', 'Simulated', 'Foster child']} />
                            <Field label="Spouse Name" field="spouseName" />
                            <Field label="Spouse Occupation" field="spouseOccupation" />
                            <Field label="No. of Children" field="numChildren" />
                        </Section>

                        {/* GUARDIAN */}
                        <Section icon="🛡️" gradient="from-indigo-400 to-violet-500" title="Guardian">
                            <Field label="Full Name" field="guardianName" colSpan={2} />
                            <Field label="Address" field="guardianAddress" colSpan={2} />
                            <Field label="Contact" field="guardianContact" />
                            <Field label="Relation" field="guardianRelation" type="select" options={['Relative', 'Not relative', 'Landlord', 'Landlady']} />
                        </Section>

                        {/* EMERGENCY CONTACT */}
                        <Section icon="🚨" gradient="from-rose-400 to-red-500" title="Emergency Contact">
                            <Field label="Full Name" field="emergencyName" colSpan={2} />
                            <Field label="Address" field="emergencyAddress" colSpan={2} />
                            <Field label="Relationship" field="emergencyRelationship" />
                            <Field label="Contact Number" field="emergencyNumber" />
                        </Section>

                        {/* EDUCATIONAL BACKGROUND */}
                        <Section icon={<Icons.Assessment />} gradient="from-cyan-400 to-blue-500" title="Educational Background">
                            <Field label="Elementary" field="elemSchool" colSpan={2} />
                            <Field label="Yr Graduated" field="elemYearGraduated" colSpan={2} />
                            <Field label="Junior High" field="juniorHighSchool" colSpan={2} />
                            <Field label="Yr Graduated" field="juniorHighYearGraduated" colSpan={2} />
                            <Field label="Senior High" field="seniorHighSchool" colSpan={2} />
                            <Field label="Yr Graduated" field="seniorHighYearGraduated" colSpan={2} />
                            <Field label="College" field="collegeSchool" colSpan={2} />
                            <Field label="Yr Graduated" field="collegeYearGraduated" colSpan={2} />
                            <Field label="School Last Attended" field="schoolLastAttended" colSpan={2} />
                            <Field label="Honors / Awards" field="honorsAwards" colSpan={2} />
                        </Section>

                        {/* ACTIVITIES & SCHOLARSHIPS */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="student-surface-card bg-white/90 backdrop-blur-sm rounded-xl border border-blue-100/50 p-6 shadow-sm card-hover">
                                <h4 className="font-bold text-sm mb-4 flex items-center gap-2"><span className="p-1.5 bg-gradient-to-br from-pink-400 to-rose-500 text-white rounded-lg text-xs">🎭</span> Extra-Curricular</h4>
                                <Field label="Activities" field="extracurricularActivities" type="textarea" />
                            </div>
                            <div className="student-surface-card bg-white/90 backdrop-blur-sm rounded-xl border border-blue-100/50 p-6 shadow-sm card-hover">
                                <h4 className="font-bold text-sm mb-4 flex items-center gap-2"><span className="p-1.5 bg-gradient-to-br from-yellow-400 to-amber-500 text-white rounded-lg text-xs">🎓</span> Scholarships</h4>
                                <Field label="Scholarships Availed" field="scholarshipsAvailed" type="textarea" />
                            </div>
                        </div>

                        {/* SPECIAL STATUS & WORKING STUDENT */}
                        <Section icon={<Icons.Counseling />} gradient="from-violet-400 to-purple-500" title="Special Status & Background">
                            <Field label="Working Student" field="isWorkingStudent" type="boolean" />
                            {personalInfo.isWorkingStudent && <Field label="Type of Work" field="workingStudentType" />}
                            <Field label="Supporter" field="supporter" />
                            <Field label="Supporter Contact" field="supporterContact" />
                            <Field label="PWD" field="isPwd" type="boolean" />
                            {personalInfo.isPwd && <Field label="PWD Type" field="pwdType" />}
                            <Field label="Indigenous" field="isIndigenous" type="boolean" />
                            {personalInfo.isIndigenous && <Field label="Indigenous Group" field="indigenousGroup" />}
                            <Field label="Witnessed Conflict" field="witnessedConflict" type="boolean" />
                            <Field label="Safe in Community" field="isSafeInCommunity" type="boolean" />
                            <Field label="Solo Parent" field="isSoloParent" type="boolean" />
                            <Field label="Child of Solo Parent" field="isChildOfSoloParent" type="boolean" />
                        </Section>

                        {/* ACADEMIC */}
                        <Section icon={<Icons.Scholarship />} gradient="from-slate-500 to-slate-700" title="Academic Details">
                            <Field label="Year Level" field="year" type="select" options={[{ value: '1st Year', label: '1st Year' }, { value: '2nd Year', label: '2nd Year' }, { value: '3rd Year', label: '3rd Year' }, { value: '4th Year', label: '4th Year' }, { value: '5th Year', label: '5th Year' }]} />
                            <Field label="Section" field="section" type="select" options={['A', 'B', 'C']} />
                            <Field label="Priority Course" field="priorityCourse" readOnly />
                            <Field label="Alt Course 1" field="altCourse1" readOnly />
                            <Field label="Alt Course 2" field="altCourse2" readOnly />
                        </Section>

                        {/* SAVE / CANCEL */}
                        {isEditing && (
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-white/80 border border-purple-100/50 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">Cancel</button>
                                <button onClick={saveProfileChanges} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-sky-400 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl btn-press transition-all">Save Changes</button>
                            </div>
                        )}
                    </div>
                )}
                {profileTab === 'engagement' && (
                    <div className="student-surface-card bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100/50 p-8 shadow-sm card-hover animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <h3 className="font-bold text-lg mb-6">Engagement History</h3>
                        <p className="text-sm text-gray-400">Your recent event attendance and platform activity.</p>
                        <div className="mt-4 space-y-3">
                            {Object.entries(attendanceMap).map(([eventId, record]: [string, any]) => (
                                <div key={eventId} className="flex items-center justify-between p-3 bg-purple-50/50 rounded-xl border border-purple-100/30">
                                    <div><p className="text-xs font-bold text-gray-700">Event #{eventId}</p><p className="text-[10px] text-gray-400">Time In: {record.time_in ? formatFullDate(new Date(record.time_in)) : '—'}</p></div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${record.time_out ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 animate-pulse'}`}>{record.time_out ? 'Completed' : 'Ongoing'}</span>
                                </div>
                            ))}
                            {Object.keys(attendanceMap).length === 0 && <p className="text-center text-gray-400 text-sm py-6">No activity records found.</p>}
                        </div>
                    </div>
                )}
                {profileTab === 'security' && (
                    <div className="student-surface-card bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100/50 p-8 shadow-sm card-hover animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><span className="p-1.5 bg-gradient-to-br from-slate-600 to-slate-800 text-white rounded-lg"><Icons.Support /></span> Security Settings</h3>
                        <p className="text-sm text-gray-400">Manage your account security and password.</p>
                        <div className="mt-6 p-4 bg-purple-50/50 rounded-xl border border-purple-100/30">
                            <p className="text-xs text-gray-500">Password management is handled through your NAT account. Contact the admin office for password resets.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

