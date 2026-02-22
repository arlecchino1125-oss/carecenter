import React from 'react';
import { createPortal } from 'react-dom';

export default function StudentProfileCompletionModal({ p }: { p: any }) {
    const {
        showProfileCompletion,
        profileStep,
        setProfileStep,
        PROFILE_TOTAL_STEPS,
        PROFILE_STEP_LABELS,
        profileFormData,
        setProfileFormData,
        handleProfileFormChange,
        handleProfileCheckboxGroup,
        handleProfileNextStep,
        profileSaving,
        handleProfileCompletion
    } = p;

    return (
        <>
            {showProfileCompletion && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="student-modal-surface bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="student-profile-completion-header p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-sky-50 text-center">
                            <h2 className="text-2xl font-black text-slate-800">Complete Your Profile</h2>
                            <p className="text-sm text-slate-500 mt-1">Please fill in the remaining information to complete your student profile.</p>
                            <div className="mt-4">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 px-1">
                                    {PROFILE_STEP_LABELS.map((label, i) => (
                                        <span key={label} className={profileStep >= i + 1 ? 'text-indigo-600' : ''}>{label}</span>
                                    ))}
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-300" style={{ width: `${(profileStep / PROFILE_TOTAL_STEPS) * 100}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto flex-1">

                            {/* STEP 1: PERSONAL INFO (NAT auto-filled + remaining) */}
                            {profileStep === 1 && (
                                <div className="space-y-4">
                                    <div className="mb-2"><h3 className="text-lg font-bold text-slate-800">Personal Information</h3><p className="text-xs text-slate-400">Fields from your application are pre-filled. You may edit them.</p></div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Last Name *</label><input name="lastName" value={profileFormData.lastName} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">First Name *</label><input name="firstName" value={profileFormData.firstName} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Suffix</label><input name="suffix" value={profileFormData.suffix} onChange={handleProfileFormChange} placeholder="Jr., II" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm placeholder:text-slate-300" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Middle Name</label><input name="middleName" value={profileFormData.middleName} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    </div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Address</label><input name="street" value={profileFormData.street} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">City</label><input name="city" value={profileFormData.city} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Province</label><input name="province" value={profileFormData.province} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Zip</label><input name="zipCode" value={profileFormData.zipCode} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Contact *</label><input name="mobile" value={profileFormData.mobile} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Email *</label><input name="email" value={profileFormData.email} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Birthday *</label><input type="date" name="dob" value={profileFormData.dob} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Age</label><input name="age" value={profileFormData.age} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" readOnly /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Sex *</label><select name="sex" value={profileFormData.sex} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Gender</label><select name="genderIdentity" value={profileFormData.genderIdentity} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"><option value="">Select</option><option value="Cis-gender">Cis-gender</option><option value="Transgender">Transgender</option><option value="Non-binary">Non-binary</option><option value="Prefer not to say">Prefer not to say</option></select></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Civil Status</label><select name="civilStatus" value={profileFormData.civilStatus} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"><option value="">Select</option><option value="Single">Single</option><option value="Married">Married</option><option value="Separated Legally">Separated Legally</option><option value="Separated Physically">Separated Physically</option><option value="With Live-In Partner">With Live-In Partner</option><option value="Divorced">Divorced</option><option value="Widow/er">Widow/er</option></select></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Nationality</label><input name="nationality" value={profileFormData.nationality} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">FB Account Link</label><input name="facebookUrl" value={profileFormData.facebookUrl} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Place of Birth</label><input name="placeOfBirth" value={profileFormData.placeOfBirth} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Religion</label><input name="religion" value={profileFormData.religion} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">School Last Attended</label><input name="schoolLastAttended" value={profileFormData.schoolLastAttended} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Year Level</label><select name="yearLevelApplying" value={profileFormData.yearLevelApplying} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"><option value="1st Year">I</option><option value="2nd Year">II</option><option value="3rd Year">III</option><option value="4th Year">IV</option></select></div>
                                    </div>
                                    {/* Supporter */}
                                    <div className="pt-3 border-t border-slate-100 space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase block">Person who supported your studies aside from parents</label>
                                        <div className="grid grid-cols-2 gap-2">{['Uncle', 'Aunt', 'Grandfather', 'Grandmother', 'Brother', 'Sister', 'Partner', 'Scholarship Grants'].map(opt => (<label key={opt} className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" value={opt} checked={(profileFormData.supporter || []).includes(opt)} onChange={e => handleProfileCheckboxGroup(e, 'supporter')} className="w-4 h-4 text-indigo-600" />{opt}</label>))}</div>
                                        <input name="supporterContact" placeholder="Supporter Contact Info" value={profileFormData.supporterContact} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm mt-2" />
                                    </div>
                                    {/* Working Student */}
                                    <div className="pt-3 border-t border-slate-100 space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase block">Are you a Working Student?</label>
                                        <div className="flex gap-4">{['Yes', 'No'].map(o => <label key={o} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="isWorkingStudent" value={o} checked={profileFormData.isWorkingStudent === o} onChange={handleProfileFormChange} className="w-4 h-4" /><span className="text-sm">{o}</span></label>)}</div>
                                        {profileFormData.isWorkingStudent === 'Yes' && <select name="workingStudentType" value={profileFormData.workingStudentType} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"><option value="">Select Type</option><option value="House help">House help</option><option value="Call Center Agent/BPO employee">Call Center Agent/BPO</option><option value="Fast food/Restaurant">Fast food/Restaurant</option><option value="Online employee/Freelancer">Online/Freelancer</option><option value="Self-employed">Self-employed</option></select>}
                                    </div>
                                    {/* PWD */}
                                    <div className="pt-3 border-t border-slate-100 space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase block">Are you a Person with a Disability (PWD)?</label>
                                        <div className="flex gap-4">{['Yes', 'No'].map(o => <label key={o} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="isPwd" value={o} checked={profileFormData.isPwd === o} onChange={handleProfileFormChange} className="w-4 h-4" /><span className="text-sm">{o}</span></label>)}</div>
                                        {profileFormData.isPwd === 'Yes' && <select name="pwdType" value={profileFormData.pwdType} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"><option value="">Select</option><option value="Visual impairment">Visual</option><option value="Hearing impairment">Hearing</option><option value="Physical/Orthopedic disability">Physical/Orthopedic</option><option value="Chronic illness">Chronic illness</option><option value="Psychosocial disability">Psychosocial</option><option value="Communication disability">Communication</option></select>}
                                    </div>
                                    {/* Indigenous */}
                                    <div className="pt-3 border-t border-slate-100 space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase block">Member of any Indigenous Group?</label>
                                        <div className="flex gap-4">{['Yes', 'No'].map(o => <label key={o} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="isIndigenous" value={o} checked={profileFormData.isIndigenous === o} onChange={handleProfileFormChange} className="w-4 h-4" /><span className="text-sm">{o}</span></label>)}</div>
                                        {profileFormData.isIndigenous === 'Yes' && <select name="indigenousGroup" value={profileFormData.indigenousGroup} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"><option value="">Select</option><option value="Bukidnon">Bukidnon</option><option value="Tabihanon Group">Tabihanon</option><option value="ATA">ATA</option><option value="IFUGAO">IFUGAO</option><option value="Kalahing Kulot">Kalahing Kulot</option><option value="Lumad">Lumad</option></select>}
                                    </div>
                                    {/* Conflict & Solo Parent */}
                                    <div className="pt-3 border-t border-slate-100 space-y-3">
                                        <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Witnessed armed conflict in your community?</label><div className="flex gap-4">{['Yes', 'No'].map(o => <label key={o} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="witnessedConflict" value={o} checked={profileFormData.witnessedConflict === o} onChange={handleProfileFormChange} className="w-4 h-4" /><span className="text-sm">{o}</span></label>)}</div></div>
                                        <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Feel safe in your community?</label><div className="flex gap-4">{['Yes', 'No'].map(o => <label key={o} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="isSafeInCommunity" value={o} checked={profileFormData.isSafeInCommunity === o} onChange={handleProfileFormChange} className="w-4 h-4" /><span className="text-sm">{o}</span></label>)}</div></div>
                                        <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Are you a Solo Parent?</label><div className="flex gap-4">{['Yes', 'No'].map(o => <label key={o} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="isSoloParent" value={o} checked={profileFormData.isSoloParent === o} onChange={handleProfileFormChange} className="w-4 h-4" /><span className="text-sm">{o}</span></label>)}</div></div>
                                        <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Son/daughter of a solo parent?</label><div className="flex gap-4">{['Yes', 'No'].map(o => <label key={o} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="isChildOfSoloParent" value={o} checked={profileFormData.isChildOfSoloParent === o} onChange={handleProfileFormChange} className="w-4 h-4" /><span className="text-sm">{o}</span></label>)}</div></div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: FAMILY BACKGROUND */}
                            {profileStep === 2 && (
                                <div className="space-y-4">
                                    <div className="mb-2"><h3 className="text-lg font-bold text-slate-800">Family Background</h3></div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Mother's Name</label><input name="motherName" placeholder="N/A if not applicable" value={profileFormData.motherName} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Mother's Occupation</label><input name="motherOccupation" placeholder="N/A" value={profileFormData.motherOccupation} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Mother's Contact</label><input name="motherContact" placeholder="N/A" value={profileFormData.motherContact} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Father's Name</label><input name="fatherName" placeholder="N/A" value={profileFormData.fatherName} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Father's Occupation</label><input name="fatherOccupation" placeholder="N/A" value={profileFormData.fatherOccupation} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Father's Contact</label><input name="fatherContact" placeholder="N/A" value={profileFormData.fatherContact} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    </div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Parent's Address</label><input name="parentAddress" placeholder="N/A" value={profileFormData.parentAddress} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">No. of Brothers</label><input name="numBrothers" placeholder="N/A" value={profileFormData.numBrothers} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">No. of Sisters</label><input name="numSisters" placeholder="N/A" value={profileFormData.numSisters} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Birth Order</label><select name="birthOrder" value={profileFormData.birthOrder} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"><option value="">Select</option>{['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Only child', 'Legally adopted', 'Simulated', 'Foster child'].map(v => <option key={v} value={v}>{v}</option>)}</select></div>
                                    </div>
                                    <div className="pt-3 border-t border-slate-100"><p className="text-xs text-slate-400 mb-2 italic">If married, fill the fields below. Type N/A if not applicable.</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Spouse Name</label><input name="spouseName" placeholder="N/A" value={profileFormData.spouseName} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Spouse Occupation</label><input name="spouseOccupation" placeholder="N/A" value={profileFormData.spouseOccupation} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">No. of Children</label><input name="numChildren" placeholder="N/A" value={profileFormData.numChildren} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: GUARDIAN */}
                            {profileStep === 3 && (
                                <div className="space-y-4">
                                    <div className="mb-2"><h3 className="text-lg font-bold text-slate-800">Guardian</h3></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Full Name</label><input name="guardianName" value={profileFormData.guardianName} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Address</label><input name="guardianAddress" value={profileFormData.guardianAddress} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Contact</label><input name="guardianContact" value={profileFormData.guardianContact} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Relation</label><select name="guardianRelation" value={profileFormData.guardianRelation} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"><option value="">Select</option><option value="Relative">Relative</option><option value="Not relative">Not relative</option><option value="Landlord">Landlord</option><option value="Landlady">Landlady</option></select></div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: EMERGENCY CONTACT */}
                            {profileStep === 4 && (
                                <div className="space-y-4">
                                    <div className="mb-2"><h3 className="text-lg font-bold text-slate-800">Person to Contact (Emergency)</h3></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Full Name</label><input name="emergencyName" value={profileFormData.emergencyName} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Address</label><input name="emergencyAddress" value={profileFormData.emergencyAddress} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Relationship</label><input name="emergencyRelationship" value={profileFormData.emergencyRelationship} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Contact Number</label><input name="emergencyNumber" value={profileFormData.emergencyNumber} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 5: EDUCATIONAL BACKGROUND */}
                            {profileStep === 5 && (
                                <div className="space-y-4">
                                    <div className="mb-2"><h3 className="text-lg font-bold text-slate-800">Educational Background</h3></div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Elementary</label><input name="elemSchool" value={profileFormData.elemSchool} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Year Graduated</label><input name="elemYearGraduated" value={profileFormData.elemYearGraduated} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Junior High School</label><input name="juniorHighSchool" value={profileFormData.juniorHighSchool} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Year Graduated</label><input name="juniorHighYearGraduated" value={profileFormData.juniorHighYearGraduated} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Senior High School</label><input name="seniorHighSchool" value={profileFormData.seniorHighSchool} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Year Graduated</label><input name="seniorHighYearGraduated" value={profileFormData.seniorHighYearGraduated} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">College</label><input name="collegeSchool" value={profileFormData.collegeSchool} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Year Graduated / Continuing</label><input name="collegeYearGraduated" value={profileFormData.collegeYearGraduated} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                    </div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Honor/Award Received</label><input name="honorsAwards" placeholder="N/A if not applicable" value={profileFormData.honorsAwards} onChange={handleProfileFormChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" /></div>
                                </div>
                            )}

                            {/* STEP 6: EXTRA-CURRICULAR */}
                            {profileStep === 6 && (
                                <div className="space-y-4">
                                    <div className="mb-2"><h3 className="text-lg font-bold text-slate-800">Extra-Curricular Involvement</h3></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Name of Activities</label><textarea name="extracurricularActivities" placeholder="N/A if not applicable" value={profileFormData.extracurricularActivities} onChange={handleProfileFormChange} rows={5} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm resize-none" /></div>
                                </div>
                            )}

                            {/* STEP 7: SCHOLARSHIPS */}
                            {profileStep === 7 && (
                                <div className="space-y-4">
                                    <div className="mb-2"><h3 className="text-lg font-bold text-slate-800">Scholarships</h3></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase">Name of Scholarship Availed</label><textarea name="scholarshipsAvailed" placeholder="N/A if not applicable" value={profileFormData.scholarshipsAvailed} onChange={handleProfileFormChange} rows={5} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm resize-none" /></div>
                                </div>
                            )}

                            {/* STEP 8: FINISH */}
                            {profileStep === 8 && (
                                <div className="space-y-6 text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto border-2 border-slate-200"><svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></div>
                                    <h3 className="text-2xl font-bold text-slate-800">Final Step</h3>
                                    <p className="text-slate-500 text-sm">Please agree to the data privacy terms to complete your profile.</p>
                                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 text-left">
                                        <h4 className="text-sm font-bold text-indigo-900 mb-2">DATA PRIVACY ACT DISCLAIMER</h4>
                                        <p className="text-xs text-indigo-800/80 mb-5 leading-relaxed">By submitting this form, I hereby authorize Negros Oriental State University (NORSU) to collect, process, and retain my personal and sensitive information for purposes of academic administration, student services, and university records in strict accordance with the Data Privacy Act of 2012 (RA 10173).</p>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${profileFormData.agreedToPrivacy ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300 group-hover:border-indigo-400'}`}>{profileFormData.agreedToPrivacy && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>}</div>
                                            <input type="checkbox" checked={profileFormData.agreedToPrivacy} onChange={e => setProfileFormData({ ...profileFormData, agreedToPrivacy: e.target.checked })} className="hidden" />
                                            <span className="text-sm font-bold text-slate-800">I have read and agree to the terms</span>
                                        </label>
                                    </div>
                                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100"><p className="text-xs text-emerald-700 italic leading-relaxed">"Thank you for completing your profile. Your responses help us serve you better!"</p></div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-between items-center rounded-b-3xl">
                            {profileStep > 1 ? (
                                <button type="button" onClick={() => setProfileStep(p => p - 1)} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors">Back</button>
                            ) : (
                                <div />
                            )}
                            {profileStep < PROFILE_TOTAL_STEPS ? (
                                <button type="button" onClick={handleProfileNextStep} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md">Next Step</button>
                            ) : (
                                <button disabled={profileSaving || !profileFormData.agreedToPrivacy} onClick={handleProfileCompletion} className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-500 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all">{profileSaving ? 'Saving...' : 'Complete Profile'}</button>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
