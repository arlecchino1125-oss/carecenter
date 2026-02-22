import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { Icons } from './portalIcons';
import type { Student } from './portalTypes';

const supabaseClient = supabase;

export default function useStudentPortalController() {
    const { session, loading } = useAuth() as any;

    const [activeView, setActiveView] = useState('dashboard');
    const [profileTab, setProfileTab] = useState('personal');
    // Timer removed from main component
    const [feedbackType, setFeedbackType] = useState('service');
    const [rating, setRating] = useState(0);
    const [counselingRequests, setCounselingRequests] = useState<any[]>([]);
    const [supportRequests, setSupportRequests] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [sessionFeedback, setSessionFeedback] = useState<any>({ rating: 0, comment: '' });
    const [activeVisit, setActiveVisit] = useState<any>(null);
    const [toast, setToast] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showCommandHub, setShowCommandHub] = useState(false);

    // Assessment State
    const [assessmentForm, setAssessmentForm] = useState<any>({
        responses: {},
        other: ''
    });
    const [activeForm, setActiveForm] = useState<any>(null);
    const [formsList, setFormsList] = useState<any[]>([]);
    const [formQuestions, setFormQuestions] = useState<any[]>([]);
    const [loadingForm, setLoadingForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [completedForms, setCompletedForms] = useState<Set<any>>(new Set());

    // Events State (Merged)
    const [eventFilter, setEventFilter] = useState('All');
    const [attendanceMap, setAttendanceMap] = useState<Record<string, any>>({}); // Stores { eventId: { time_in, time_out } }
    const [ratedEvents, setRatedEvents] = useState<any[]>([]);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingForm, setRatingForm] = useState<any>({ eventId: null, title: '', rating: 0, comment: '', q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, open_best: '', open_suggestions: '', open_comments: '' });

    // Modals & Dynamic States
    const [showCounselingForm, setShowCounselingForm] = useState(false);
    const [counselingForm, setCounselingForm] = useState<any>({ reason_for_referral: '', personal_actions_taken: '', date_duration_of_concern: '' });
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [showCounselingRequestsModal, setShowCounselingRequestsModal] = useState(false);
    const [showSupportRequestsModal, setShowSupportRequestsModal] = useState(false);
    const [supportForm, setSupportForm] = useState<any>({
        categories: [], otherCategory: '',
        q1: '', q2: '', q3: '', q4: '',
        file: null
    });
    const [showScholarshipModal, setShowScholarshipModal] = useState(false);
    const [selectedScholarship, setSelectedScholarship] = useState<any>(null);

    // Office Logbook Modal State
    const [showTimeInModal, setShowTimeInModal] = useState(false);
    const [visitReasons, setVisitReasons] = useState<any[]>([]);
    const [selectedReason, setSelectedReason] = useState('');

    const [proofFile, setProofFile] = useState<any>(null);
    const [isTimingIn, setIsTimingIn] = useState(false);

    // Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [personalInfo, setPersonalInfo] = useState<Student>({
        firstName: "", lastName: "", middleName: "", suffix: "",
        studentId: "", department: "", course: "", year: "", section: "", status: "",
        address: "", street: "", city: "", province: "", zipCode: "",
        mobile: "", email: "", facebookUrl: "", emergencyContact: "",
        dob: "", age: "", placeOfBirth: "",
        sex: "", gender: "", genderIdentity: "",
        civilStatus: "", nationality: "",
        priorityCourse: "", altCourse1: "", altCourse2: "",
        schoolLastAttended: "",
        isWorkingStudent: false, workingStudentType: "",
        supporter: "", supporterContact: "",
        isPwd: false, pwdType: "",
        isIndigenous: false, indigenousGroup: "",
        witnessedConflict: "",
        isSoloParent: false, isChildOfSoloParent: false,
        profile_picture_url: ""
    });
    const [showMoreProfile, setShowMoreProfile] = useState(false);
    const [isUploadingProfilePicture, setIsUploadingProfilePicture] = useState(false);

    // Onboarding Tour State
    const [showTour, setShowTour] = useState(false);
    const [tourStep, setTourStep] = useState(0);
    const [hasSeenTourState, setHasSeenTourState] = useState(true); // Default true

    // Profile Completion Modal State
    const [showProfileCompletion, setShowProfileCompletion] = useState(false);
    const [profileStep, setProfileStep] = useState(1);
    const PROFILE_TOTAL_STEPS = 8;
    const PROFILE_STEP_LABELS = ['Personal', 'Family', 'Guardian', 'Emergency', 'Education', 'Activities', 'Scholarships', 'Finish'];
    const [profileFormData, setProfileFormData] = useState<any>({
        // Auto-filled from NAT
        firstName: '', lastName: '', middleName: '', suffix: '',
        dob: '', age: '', placeOfBirth: '',
        nationality: '', sex: '', genderIdentity: '', civilStatus: '',
        street: '', city: '', province: '', zipCode: '',
        mobile: '', email: '', facebookUrl: '',
        // New fields to collect
        religion: '', schoolLastAttended: '', yearLevelApplying: '1st Year',
        supporter: [] as string[], supporterContact: '',
        isWorkingStudent: '', workingStudentType: '',
        isPwd: '', pwdType: '',
        isIndigenous: '', indigenousGroup: '',
        witnessedConflict: '', isSafeInCommunity: '',
        isSoloParent: '', isChildOfSoloParent: '',
        // Family
        motherName: '', motherOccupation: '', motherContact: '',
        fatherName: '', fatherOccupation: '', fatherContact: '',
        parentAddress: '', numBrothers: '', numSisters: '', birthOrder: '',
        spouseName: '', spouseOccupation: '', numChildren: '',
        // Guardian
        guardianName: '', guardianAddress: '', guardianContact: '', guardianRelation: '',
        // Emergency
        emergencyName: '', emergencyAddress: '', emergencyRelationship: '', emergencyNumber: '',
        // Education
        elemSchool: '', elemYearGraduated: '',
        juniorHighSchool: '', juniorHighYearGraduated: '',
        seniorHighSchool: '', seniorHighYearGraduated: '',
        collegeSchool: '', collegeYearGraduated: '',
        honorsAwards: '',
        // Extra-curricular & Scholarships
        extracurricularActivities: '', scholarshipsAvailed: '',
        agreedToPrivacy: false,
    });
    const [profileSaving, setProfileSaving] = useState(false);

    const handleProfileFormChange = (e: any) => {
        const { name, value } = e.target;
        setProfileFormData((prev: any) => ({ ...prev, [name]: value }));
    };
    const handleProfileCheckboxGroup = (e: any, field: string) => {
        const val = e.target.value;
        const checked = e.target.checked;
        setProfileFormData((prev: any) => {
            const arr = prev[field] || [];
            return { ...prev, [field]: checked ? [...arr, val] : arr.filter((v: string) => v !== val) };
        });
    };

    const handleProfileNextStep = () => {
        setProfileStep(prev => Math.min(prev + 1, PROFILE_TOTAL_STEPS));
    };

    const handleProfileCompletion = async () => {
        if (!profileFormData.agreedToPrivacy) return;
        setProfileSaving(true);
        try {
            const payload: any = {
                // Personal (auto-filled + new)
                first_name: profileFormData.firstName, last_name: profileFormData.lastName,
                middle_name: profileFormData.middleName, suffix: profileFormData.suffix,
                dob: profileFormData.dob || null, age: profileFormData.age || null,
                place_of_birth: profileFormData.placeOfBirth, nationality: profileFormData.nationality,
                sex: profileFormData.sex, gender_identity: profileFormData.genderIdentity,
                civil_status: profileFormData.civilStatus,
                street: profileFormData.street, city: profileFormData.city,
                province: profileFormData.province, zip_code: profileFormData.zipCode,
                mobile: profileFormData.mobile, email: profileFormData.email,
                facebook_url: profileFormData.facebookUrl,
                religion: profileFormData.religion, school_last_attended: profileFormData.schoolLastAttended,
                year_level: profileFormData.yearLevelApplying,
                supporter: (profileFormData.supporter || []).join(', '),
                supporter_contact: profileFormData.supporterContact,
                is_working_student: profileFormData.isWorkingStudent === 'Yes',
                working_student_type: profileFormData.workingStudentType,
                is_pwd: profileFormData.isPwd === 'Yes', pwd_type: profileFormData.pwdType,
                is_indigenous: profileFormData.isIndigenous === 'Yes', indigenous_group: profileFormData.indigenousGroup,
                witnessed_conflict: profileFormData.witnessedConflict, is_safe_in_community: profileFormData.isSafeInCommunity,
                is_solo_parent: profileFormData.isSoloParent === 'Yes',
                is_child_of_solo_parent: profileFormData.isChildOfSoloParent === 'Yes',
                // Family
                mother_name: profileFormData.motherName, mother_occupation: profileFormData.motherOccupation,
                mother_contact: profileFormData.motherContact,
                father_name: profileFormData.fatherName, father_occupation: profileFormData.fatherOccupation,
                father_contact: profileFormData.fatherContact,
                parent_address: profileFormData.parentAddress,
                num_brothers: profileFormData.numBrothers, num_sisters: profileFormData.numSisters,
                birth_order: profileFormData.birthOrder,
                spouse_name: profileFormData.spouseName, spouse_occupation: profileFormData.spouseOccupation,
                num_children: profileFormData.numChildren,
                // Guardian
                guardian_name: profileFormData.guardianName, guardian_address: profileFormData.guardianAddress,
                guardian_contact: profileFormData.guardianContact, guardian_relation: profileFormData.guardianRelation,
                // Emergency
                emergency_name: profileFormData.emergencyName, emergency_address: profileFormData.emergencyAddress,
                emergency_relationship: profileFormData.emergencyRelationship, emergency_number: profileFormData.emergencyNumber,
                // Education
                elem_school: profileFormData.elemSchool, elem_year_graduated: profileFormData.elemYearGraduated,
                junior_high_school: profileFormData.juniorHighSchool, junior_high_year_graduated: profileFormData.juniorHighYearGraduated,
                senior_high_school: profileFormData.seniorHighSchool, senior_high_year_graduated: profileFormData.seniorHighYearGraduated,
                college_school: profileFormData.collegeSchool, college_year_graduated: profileFormData.collegeYearGraduated,
                honors_awards: profileFormData.honorsAwards,
                // Activities & Scholarships
                extracurricular_activities: profileFormData.extracurricularActivities,
                scholarships_availed: profileFormData.scholarshipsAvailed,
                profile_completed: true,
            };
            const { error } = await supabaseClient.from('students').update(payload).eq('student_id', personalInfo.studentId);
            if (error) throw error;
            setShowProfileCompletion(false);
            showToast('Profile completed successfully!');
        } catch (err: any) {
            console.error('Profile completion error:', err);
            showToast(err.message || 'Error saving profile', 'error');
        } finally {
            setProfileSaving(false);
        }
    };

    const [eventsList, setEventsList] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    // Scholarship State
    const [scholarshipsList, setScholarshipsList] = useState<any[]>([]);
    const [myApplications, setMyApplications] = useState<any[]>([]);

    useEffect(() => {
        const checkSession = async () => {
            if (!session?.user?.id) return;
            try {
                // Fetch student data
                const { data: studentData, error: studentError } = await supabaseClient
                    .from('students')
                    .select('*')
                    .eq('student_id', session.user.id) // Assuming auth id maps to student_id or email
                    .single();

                if (studentError) {
                    console.error('Error fetching student data:', studentError);
                } else if (studentData) {
                    setPersonalInfo((prev: any) => ({
                        ...prev,
                        firstName: studentData.first_name,
                        lastName: studentData.last_name,
                        middleName: studentData.middle_name,
                        suffix: studentData.suffix,
                        studentId: studentData.student_id,
                        department: studentData.department,
                        course: studentData.course,
                        year: studentData.year_level,
                        section: studentData.section,
                        status: studentData.status,
                        address: studentData.address,
                        mobile: studentData.mobile,
                        email: studentData.email,
                        facebookUrl: studentData.facebook_url,
                        dob: studentData.dob,
                        age: studentData.age,
                        sex: studentData.sex,
                        ...studentData
                    }));

                    // Profile completion detection moved to fetchAndSyncProfile
                }
            } catch (err: any) {
                console.error('Unexpected error:', err);
            }
        };

        checkSession();

        if (!session) return;

        const fetchScholarships = async () => {
            const { data } = await supabaseClient.from('scholarships').select('*').order('deadline', { ascending: true });
            setScholarshipsList(data || []);
        };
        const fetchApplications = async () => {
            const { data } = await supabaseClient.from('scholarship_applications').select('scholarship_id, status').eq('student_id', personalInfo.studentId);
            setMyApplications(data || []);
        };

        // Call independent fetches
        fetchScholarships();
        if (personalInfo.studentId) {
            fetchApplications();
        }

        const sub = supabaseClient.channel('scholarships_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'scholarships' }, fetchScholarships)
            .subscribe();

        return () => {
            supabaseClient.removeChannel(sub);
        };
    }, [session, personalInfo.studentId]);

    const handleApplyScholarship = async (scholarship: any) => {
        if (!scholarship) return;
        // Verify profile completeness
        if (!personalInfo.mobile || !personalInfo.email) {
            showToast("Please update your contact info (Mobile & Email) in Profile first.", "error"); return;
        }

        try {
            const { error } = await supabaseClient.from('scholarship_applications').insert([{
                scholarship_id: scholarship.id,
                student_id: personalInfo.studentId,
                student_name: `${personalInfo.firstName} ${personalInfo.lastName}`,
                course: personalInfo.course,
                year_level: personalInfo.year,
                contact_number: personalInfo.mobile,
                email: personalInfo.email,
                status: 'Pending'
            }]);

            if (error) throw error;
            showToast("Application submitted successfully!");
            setMyApplications([...myApplications, { scholarship_id: scholarship.id, status: 'Pending' }]);
            setShowScholarshipModal(false);
        } catch (err: any) {
            showToast(err.message, "error");
        }
    };

    const showToast = (message: string, type: string = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Timer removed (handled by Clock component)

    // Helper to determine department from course
    // Removed hardcoded getDepartment in favor of dynamic fetch

    // Sync session to personalInfo
    useEffect(() => {
        const fetchAndSyncProfile = async () => {
            if (session && session.userType === 'student') {
                const studentData = session;
                const course = studentData.course || '';

                let matchedDepartment = studentData.department || 'Unassigned';

                // If department is missing or generic, try to fetch it dynamically
                if (!studentData.department && course) {
                    const { data: courseData } = await supabaseClient
                        .from('courses')
                        .select('name, departments(name)')
                        .eq('name', course)
                        .maybeSingle();

                    if (courseData && courseData.departments && (courseData.departments as any).name) {
                        matchedDepartment = (courseData.departments as any).name;
                    }
                }

                setPersonalInfo((prev: any) => ({
                    ...prev,
                    firstName: studentData.first_name || '',
                    lastName: studentData.last_name || '',
                    middleName: studentData.middle_name || '',
                    suffix: studentData.suffix || '',
                    studentId: studentData.student_id,
                    course: course,
                    year: studentData.year_level || '1st Year',
                    status: studentData.status || 'Active',
                    department: matchedDepartment,
                    section: studentData.section || '',
                    email: studentData.email || '',
                    mobile: studentData.mobile || '',
                    facebookUrl: studentData.facebook_url || '',
                    address: studentData.address || '',
                    street: studentData.street || '',
                    city: studentData.city || '',
                    province: studentData.province || '',
                    zipCode: studentData.zip_code || '',
                    emergencyContact: studentData.emergency_contact || '',
                    dob: studentData.dob || '',
                    age: studentData.age || '',
                    placeOfBirth: studentData.place_of_birth || '',
                    sex: studentData.sex || '',
                    gender: studentData.gender || '',
                    genderIdentity: studentData.gender_identity || '',
                    civilStatus: studentData.civil_status || '',
                    nationality: studentData.nationality || '',
                    priorityCourse: studentData.priority_course || '',
                    altCourse1: studentData.alt_course_1 || '',
                    altCourse2: studentData.alt_course_2 || '',
                    schoolLastAttended: studentData.school_last_attended || '',
                    isWorkingStudent: studentData.is_working_student || false,
                    workingStudentType: studentData.working_student_type || '',
                    supporter: studentData.supporter || '',
                    supporterContact: studentData.supporter_contact || '',
                    isPwd: studentData.is_pwd || false,
                    pwdType: studentData.pwd_type || '',
                    isIndigenous: studentData.is_indigenous || false,
                    indigenousGroup: studentData.indigenous_group || '',
                    witnessedConflict: studentData.witnessed_conflict || '',
                    isSoloParent: studentData.is_solo_parent || false,
                    isChildOfSoloParent: studentData.is_child_of_solo_parent || false,
                    // New fields
                    religion: studentData.religion || '',
                    isSafeInCommunity: studentData.is_safe_in_community || false,
                    motherName: studentData.mother_name || '',
                    motherOccupation: studentData.mother_occupation || '',
                    motherContact: studentData.mother_contact || '',
                    fatherName: studentData.father_name || '',
                    fatherOccupation: studentData.father_occupation || '',
                    fatherContact: studentData.father_contact || '',
                    parentAddress: studentData.parent_address || '',
                    numBrothers: studentData.num_brothers || '',
                    numSisters: studentData.num_sisters || '',
                    birthOrder: studentData.birth_order || '',
                    spouseName: studentData.spouse_name || '',
                    spouseOccupation: studentData.spouse_occupation || '',
                    numChildren: studentData.num_children || '',
                    guardianName: studentData.guardian_name || '',
                    guardianAddress: studentData.guardian_address || '',
                    guardianContact: studentData.guardian_contact || '',
                    guardianRelation: studentData.guardian_relation || '',
                    emergencyName: studentData.emergency_name || '',
                    emergencyAddress: studentData.emergency_address || '',
                    emergencyRelationship: studentData.emergency_relationship || '',
                    emergencyNumber: studentData.emergency_number || '',
                    elemSchool: studentData.elem_school || '',
                    elemYearGraduated: studentData.elem_year_graduated || '',
                    juniorHighSchool: studentData.junior_high_school || '',
                    juniorHighYearGraduated: studentData.junior_high_year_graduated || '',
                    seniorHighSchool: studentData.senior_high_school || '',
                    seniorHighYearGraduated: studentData.senior_high_year_graduated || '',
                    collegeSchool: studentData.college_school || '',
                    collegeYearGraduated: studentData.college_year_graduated || '',
                    honorsAwards: studentData.honors_awards || '',
                    extracurricularActivities: studentData.extracurricular_activities || '',
                    scholarshipsAvailed: studentData.scholarships_availed || '',
                    profile_picture_url: studentData.profile_picture_url || '',
                }));

                // Check if profile completion is needed
                const hasExtendedProfileData = [
                    studentData.mother_name,
                    studentData.father_name,
                    studentData.guardian_name,
                    studentData.emergency_name,
                    studentData.elem_school,
                    studentData.junior_high_school,
                    studentData.senior_high_school,
                    studentData.college_school,
                    studentData.extracurricular_activities,
                    studentData.scholarships_availed
                ].some((v: any) => typeof v === 'string' ? v.trim() !== '' : v !== null && v !== undefined);

                const isProfileCompleted = Boolean(studentData.profile_completed) || hasExtendedProfileData;

                // One-time auto-heal for legacy activated records that already contain extended profile data.
                if (!studentData.profile_completed && hasExtendedProfileData && studentData.student_id) {
                    await supabaseClient
                        .from('students')
                        .update({ profile_completed: true })
                        .eq('student_id', studentData.student_id);
                }

                console.log('[ProfileCompletion] profile_completed =', studentData.profile_completed, 'extended_data =', hasExtendedProfileData);
                if (!isProfileCompleted) {
                    console.log('[ProfileCompletion] Showing profile completion modal');
                    setProfileFormData((prev: any) => ({
                        ...prev,
                        firstName: studentData.first_name || '',
                        lastName: studentData.last_name || '',
                        middleName: studentData.middle_name || '',
                        suffix: studentData.suffix || '',
                        dob: studentData.dob || '',
                        age: studentData.age || '',
                        placeOfBirth: studentData.place_of_birth || '',
                        nationality: studentData.nationality || '',
                        sex: studentData.sex || '',
                        genderIdentity: studentData.gender_identity || '',
                        civilStatus: studentData.civil_status || '',
                        street: studentData.street || '',
                        city: studentData.city || '',
                        province: studentData.province || '',
                        zipCode: studentData.zip_code || '',
                        mobile: studentData.mobile || '',
                        email: studentData.email || '',
                        facebookUrl: studentData.facebook_url || '',
                    }));
                    setShowProfileCompletion(true);
                }

                // Set Onboarding Tour State
                setHasSeenTourState(Boolean(studentData.has_seen_tour));
            }
        };

        fetchAndSyncProfile();
    }, [session]);

    // Sequences the Tour to appear AFTER Profile Completion closes
    useEffect(() => {
        if (!loading && session && !showProfileCompletion && !hasSeenTourState) {
            setShowTour(true);
        }
    }, [loading, session, showProfileCompletion, hasSeenTourState]);

    // Save Profile Changes to Supabase
    const saveProfileChanges = async () => {
        setIsEditing(false);
        try {
            const updatePayload = {
                first_name: personalInfo.firstName || null,
                last_name: personalInfo.lastName || null,
                middle_name: personalInfo.middleName || null,
                suffix: personalInfo.suffix || null,
                place_of_birth: personalInfo.placeOfBirth || null,
                department: personalInfo.department || null,
                address: personalInfo.address || null,
                street: personalInfo.street || null,
                city: personalInfo.city || null,
                province: personalInfo.province || null,
                zip_code: personalInfo.zipCode || null,
                mobile: personalInfo.mobile || null,
                email: personalInfo.email || null,
                civil_status: personalInfo.civilStatus || null,
                emergency_contact: personalInfo.emergencyContact || null,
                facebook_url: personalInfo.facebookUrl || null,
                dob: personalInfo.dob || null,
                sex: personalInfo.sex || null,
                gender: personalInfo.gender || null,
                gender_identity: personalInfo.genderIdentity || null,
                nationality: personalInfo.nationality || null,
                school_last_attended: personalInfo.schoolLastAttended || null,
                is_working_student: Boolean(personalInfo.isWorkingStudent),
                working_student_type: personalInfo.workingStudentType || null,
                supporter: personalInfo.supporter || null,
                supporter_contact: personalInfo.supporterContact || null,
                is_pwd: Boolean(personalInfo.isPwd),
                pwd_type: personalInfo.pwdType || null,
                is_indigenous: Boolean(personalInfo.isIndigenous),
                indigenous_group: personalInfo.indigenousGroup || null,
                witnessed_conflict: Boolean(personalInfo.witnessedConflict),
                is_solo_parent: Boolean(personalInfo.isSoloParent),
                is_child_of_solo_parent: Boolean(personalInfo.isChildOfSoloParent),
                section: personalInfo.section || null,
                year_level: personalInfo.year || null,
                // New fields
                religion: personalInfo.religion || null,
                is_safe_in_community: Boolean(personalInfo.isSafeInCommunity),
                mother_name: personalInfo.motherName || null,
                mother_occupation: personalInfo.motherOccupation || null,
                mother_contact: personalInfo.motherContact || null,
                father_name: personalInfo.fatherName || null,
                father_occupation: personalInfo.fatherOccupation || null,
                father_contact: personalInfo.fatherContact || null,
                parent_address: personalInfo.parentAddress || null,
                num_brothers: personalInfo.numBrothers || null,
                num_sisters: personalInfo.numSisters || null,
                birth_order: personalInfo.birthOrder || null,
                spouse_name: personalInfo.spouseName || null,
                spouse_occupation: personalInfo.spouseOccupation || null,
                num_children: personalInfo.numChildren || null,
                guardian_name: personalInfo.guardianName || null,
                guardian_address: personalInfo.guardianAddress || null,
                guardian_contact: personalInfo.guardianContact || null,
                guardian_relation: personalInfo.guardianRelation || null,
                emergency_name: personalInfo.emergencyName || null,
                emergency_address: personalInfo.emergencyAddress || null,
                emergency_relationship: personalInfo.emergencyRelationship || null,
                emergency_number: personalInfo.emergencyNumber || null,
                elem_school: personalInfo.elemSchool || null,
                elem_year_graduated: personalInfo.elemYearGraduated || null,
                junior_high_school: personalInfo.juniorHighSchool || null,
                junior_high_year_graduated: personalInfo.juniorHighYearGraduated || null,
                senior_high_school: personalInfo.seniorHighSchool || null,
                senior_high_year_graduated: personalInfo.seniorHighYearGraduated || null,
                college_school: personalInfo.collegeSchool || null,
                college_year_graduated: personalInfo.collegeYearGraduated || null,
                honors_awards: personalInfo.honorsAwards || null,
                extracurricular_activities: personalInfo.extracurricularActivities || null,
                scholarships_availed: personalInfo.scholarshipsAvailed || null,
            };

            const { error } = await supabaseClient
                .from('students')
                .update(updatePayload)
                .eq('student_id', personalInfo.studentId);

            if (error) throw error;
            showToast("Profile updated successfully!");
        } catch (err: any) {
            showToast("Error saving profile: " + err.message, 'error');
        }
    };

    const handleProfilePictureUpload = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!personalInfo.studentId) {
            showToast('Student ID not found. Please relogin.', 'error');
            e.target.value = '';
            return;
        }
        if (!file.type?.startsWith('image/')) {
            showToast('Please select an image file.', 'error');
            e.target.value = '';
            return;
        }

        setIsUploadingProfilePicture(true);
        try {
            const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
            const safeExt = (ext || 'jpg').toLowerCase();
            const fileName = `${personalInfo.studentId}/${Date.now()}-profile.${safeExt}`;

            const { error: uploadError } = await supabaseClient.storage
                .from('profile-pictures')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabaseClient.storage
                .from('profile-pictures')
                .getPublicUrl(fileName);

            const publicUrl = publicUrlData?.publicUrl || '';
            if (!publicUrl) throw new Error('Failed to resolve image URL');

            const { error: updateError } = await supabaseClient
                .from('students')
                .update({ profile_picture_url: publicUrl })
                .eq('student_id', personalInfo.studentId);

            if (updateError) throw updateError;

            setPersonalInfo((prev: any) => ({ ...prev, profile_picture_url: publicUrl }));
            showToast('Profile picture updated!');
        } catch (err: any) {
            showToast(err.message || 'Error uploading profile picture', 'error');
        } finally {
            setIsUploadingProfilePicture(false);
            e.target.value = '';
        }
    };

    // Fetch Events from Supabase
    useEffect(() => {
        const fetchEvents = async () => {
            const { data } = await supabaseClient.from('events').select('*').order('created_at', { ascending: false });
            if (data) setEventsList(data);
        };
        fetchEvents();
    }, [activeView]);

    // Fetch All Active Forms
    useEffect(() => {
        if (activeView === 'assessment') {
            const fetchForms = async () => {
                setLoadingForm(true);
                const { data: forms } = await supabaseClient
                    .from('forms')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });

                if (forms) {
                    setFormsList(forms);
                }

                // Fetch already-completed submissions for this student
                if (personalInfo.studentId) {
                    const { data: subs } = await supabaseClient
                        .from('submissions')
                        .select('form_id')
                        .eq('student_id', personalInfo.studentId);
                    if (subs) {
                        setCompletedForms(new Set(subs.map((s: any) => s.form_id)));
                    }
                }

                setLoadingForm(false);
            };
            fetchForms();
        }
    }, [activeView]);

    // Fetch Counseling Requests
    useEffect(() => {
        if (activeView === 'counseling') {
            const fetchRequests = async () => {
                const { data, error } = await supabaseClient
                    .from('counseling_requests')
                    .select('*')
                    .eq('student_id', personalInfo.studentId)
                    .order('created_at', { ascending: false });
                if (data) setCounselingRequests(data);
            };
            fetchRequests();
        }
        // Fetch Notifications
        if (activeView === 'dashboard' || activeView === 'counseling') {
            const fetchNotifications = async () => {
                const { data } = await supabaseClient.from('notifications')
                    .select('*').eq('student_id', personalInfo.studentId).order('created_at', { ascending: false }).limit(5);
                if (data) setNotifications(data);
            };
            fetchNotifications();
        }

        // Fetch Support Requests
        if (activeView === 'support') {
            const fetchSupport = async () => {
                const { data } = await supabaseClient.from('support_requests').select('*').eq('student_id', personalInfo.studentId).order('created_at', { ascending: false });
                if (data) setSupportRequests(data);
            };
            fetchSupport();
        }



        // Real-time Subscriptions
        const channel = supabaseClient
            .channel('student_counseling')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'counseling_requests', filter: `student_id=eq.${personalInfo.studentId}` }, () => {
                if (activeView === 'counseling') {
                    const fetchRequests = async () => {
                        const { data } = await supabaseClient.from('counseling_requests').select('*').eq('student_id', personalInfo.studentId).order('created_at', { ascending: false });
                        if (data) setCounselingRequests(data);
                    };
                    fetchRequests();
                }
            })
            .subscribe();

        const supportChannel = supabaseClient
            .channel('student_support')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'support_requests', filter: `student_id=eq.${personalInfo?.studentId}` }, () => {
                if (activeView === 'support') {
                    const fetchSupport = async () => {
                        try {
                            const { data, error } = await supabaseClient.from('support_requests').select('*').eq('student_id', personalInfo?.studentId).order('created_at', { ascending: false });
                            if (error) console.error("Error fetching support:", error);
                            if (data) setSupportRequests(data);
                        } catch (err) {
                            console.error("Unexpected error fetching support:", err);
                        }
                    };
                    fetchSupport();
                }
            })
            .subscribe();

        const notifChannel = supabaseClient
            .channel('student_notifications')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `student_id=eq.${personalInfo.studentId}` }, (payload: any) => {
                setNotifications((prev: any) => [payload.new, ...prev]);
            })
            .subscribe();

        const eventsChannel = supabaseClient
            .channel('student_events')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
                const refetchEvents = async () => {
                    const { data } = await supabaseClient.from('events').select('*').order('created_at', { ascending: false });
                    if (data) setEventsList(data);
                };
                refetchEvents();
            })
            .subscribe();

        const attendanceChannel = supabaseClient
            .channel('student_attendance')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'event_attendance', filter: `student_id=eq.${personalInfo?.studentId}` }, () => {
                fetchHistory();
            })
            .subscribe();

        const formsChannel = supabaseClient
            .channel('student_forms')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'forms', filter: 'is_active=eq.true' }, () => {
                const fetchForms = async () => {
                    const { data } = await supabaseClient.from('forms').select('*').eq('is_active', true).order('created_at', { ascending: false });
                    if (data) setFormsList(data);
                };
                fetchForms();
            })
            .subscribe();

        const applicationsChannel = supabaseClient
            .channel('student_applications')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'applications', filter: `student_id=eq.${personalInfo?.studentId}` }, (payload: any) => {
                showToast(`Application Status Updated: ${payload.new.status}`, 'info');
            })
            .subscribe();

        const profileChannel = supabaseClient
            .channel('student_profile_update')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'students', filter: `student_id=eq.${personalInfo?.studentId}` }, (payload: any) => {
                // Update personal info state locally
                setPersonalInfo((prev: any) => ({ ...prev, ...payload.new })); // This might need mapping if column names differ from state names
                showToast("Your profile has been updated by an administrator.", 'info');
                // Ideally we should re-map the snake_case payload to camelCase state, but for now this alerts the user. 
                // To be safe, let's trigger a re-fetch of the profile or just let the user know.
            })
            .subscribe();

        return () => {
            const channels = [channel, supportChannel, notifChannel, eventsChannel, attendanceChannel, formsChannel, applicationsChannel, profileChannel];
            channels.forEach(ch => {
                if (ch) supabaseClient.removeChannel(ch).catch(() => { });
            });
        };
    }, [activeView, personalInfo.studentId]);

    // Real-time subscription for counseling requests with toast (Moved from nested effect)
    useEffect(() => {
        if (!personalInfo.studentId) return;

        const fetchCounseling_Realtime = async () => {
            const { data } = await supabaseClient.from('counseling_requests').select('*').eq('student_id', personalInfo.studentId).order('created_at', { ascending: false });
            if (data) setCounselingRequests(data);
        };

        fetchCounseling_Realtime();

        const channel = supabaseClient.channel('student_counseling_updates')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'counseling_requests', filter: `student_id=eq.${personalInfo.studentId}` }, (payload: any) => {
                fetchCounseling_Realtime();
                if (payload.new.status !== payload.old.status) {
                    showToast(`Counseling Request Status Updated: ${payload.new.status}`, 'info');
                }
            })
            .subscribe();

        return () => { supabaseClient.removeChannel(channel); };
    }, [personalInfo.studentId]);

    // Fetch Active Office Visit
    useEffect(() => {
        const fetchVisit = async () => {
            const { data } = await supabaseClient.from('office_visits').select('*').eq('student_id', personalInfo.studentId).eq('status', 'Ongoing').maybeSingle();
            if (data) setActiveVisit(data);
        };
        if (personalInfo.studentId) fetchVisit();
    }, [personalInfo.studentId]);

    // Fetch Visit Reasons
    useEffect(() => {
        const fetchReasons = async () => {
            const { data } = await supabaseClient.from('office_visit_reasons').select('*').eq('is_active', true).order('reason');
            if (data) setVisitReasons(data);
        };
        fetchReasons();
    }, []);

    const formatFullDate = (date: any) => date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const formatTime = (date: any) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    // Fetch Attendance and Rating History
    const fetchHistory = async () => {
        if (!personalInfo.studentId) return;

        // Attendance
        const { data: attendanceData } = await supabaseClient
            .from('event_attendance')
            .select('*')
            .eq('student_id', personalInfo.studentId);

        if (attendanceData) {
            const map: Record<string, any> = {};
            attendanceData.forEach((r: any) => map[r.event_id] = r);
            setAttendanceMap(map);
        }

        // Ratings
        const { data: ratingData } = await supabaseClient
            .from('event_feedback')
            .select('event_id')
            .eq('student_id', personalInfo.studentId);

        if (ratingData) {
            setRatedEvents(ratingData.map((row: any) => row.event_id));
        }
    };

    // Fetch on load AND when switching views (to keep sync)
    useEffect(() => {
        fetchHistory();
    }, [personalInfo.studentId, activeView]);

    const handleTimeIn = async (event: any) => {
        if (isTimingIn) return;
        if (!proofFile) { showToast("Please upload a proof photo to Time In.", 'error'); return; }

        if (!navigator.geolocation) { showToast("Geolocation is not supported by your browser.", 'error'); return; }
        setIsTimingIn(true);

        const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
        navigator.geolocation.getCurrentPosition(async (position: any) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // --- CAMPUS COORDINATES (Update these with real values) ---
            const targetLat = event.latitude || 9.306;
            const targetLng = event.longitude || 123.306;
            const MAX_DISTANCE_METERS = 200; // Realistic campus radius

            // Haversine Formula to calculate distance
            const R = 6371e3; // Earth radius in meters
            const f1 = userLat * Math.PI / 180;
            const f2 = targetLat * Math.PI / 180;
            const Δφ = (targetLat - userLat) * Math.PI / 180;
            const Δλ = (targetLng - userLng) * Math.PI / 180;
            const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(f1) * Math.cos(f2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;

            if (distance > MAX_DISTANCE_METERS) {
                showToast(`You are too far from campus (${Math.round(distance)}m).`, 'error');
                setIsTimingIn(false);
                return;
            }

            try {
                // Upload Proof
                const fileName = `${personalInfo.studentId}_${event.id}_${Date.now()}.jpg`;
                const { data: uploadData, error: uploadError } = await supabaseClient.storage.from('attendance_proofs').upload(fileName, proofFile, {
                    contentType: proofFile.type,
                    upsert: false
                });
                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabaseClient.storage.from('attendance_proofs').getPublicUrl(fileName);
                const proofUrl = publicUrlData.publicUrl;

                // Record Time In
                const now = new Date().toISOString();
                const { error } = await supabaseClient.from('event_attendance').insert([{
                    event_id: event.id,
                    student_id: personalInfo.studentId,
                    student_name: `${personalInfo.firstName} ${personalInfo.lastName}`,
                    time_in: now,
                    proof_url: proofUrl,
                    latitude: userLat,
                    longitude: userLng,
                    department: personalInfo.department
                }]);
                if (error) throw error;

                // Increment Count using atomic RPC to prevent concurrency bugs
                const { error: rpcError } = await supabaseClient.rpc('increment_event_attendees', { e_id: event.id });
                if (rpcError) {
                    console.error("RPC Error:", rpcError);
                    // Fallback to manual if RPC doesn't exist yet, but note it's prone to concurrency issues
                    const { data: countData } = await supabaseClient.from('events').select('attendees').eq('id', event.id).single();
                    await supabaseClient.from('events').update({ attendees: (countData?.attendees || 0) + 1 }).eq('id', event.id);
                }

                setAttendanceMap((prev: any) => ({ ...prev, [event.id]: { event_id: event.id, time_in: now, time_out: null } }));
                setEventsList((prev: any) => prev.map((e: any) => e.id === event.id ? { ...e, attendees: (e.attendees || 0) + 1 } : e));
                setProofFile(null);
                showToast("Time In Successful! Location Verified.");
            } catch (err: any) {
                console.error("Time In Error:", err);
                if (err.code === '23505') {
                    showToast("You have already timed in for this event.", 'error');
                    // Refresh attendance to sync state
                    const { data } = await supabaseClient.from('event_attendance').select('*').eq('event_id', event.id).eq('student_id', personalInfo.studentId).single();
                    if (data) setAttendanceMap((prev: any) => ({ ...prev, [event.id]: data }));
                } else {
                    showToast("Error: " + (err.message || "Unknown error"), 'error');
                }
            } finally {
                setIsTimingIn(false);
            }
        }, (error: any) => {
            setIsTimingIn(false);
            let msg = "Location check failed.";
            if (error.code === 1) msg = "Permission denied. Please allow location access.";
            else if (error.code === 2) msg = "Position unavailable. Ensure GPS/WiFi is on.";
            else if (error.code === 3) msg = "Location request timed out.";
            showToast(msg, 'error');
        }, options);
    };

    const handleTimeOut = async (event: any) => {
        if (!navigator.geolocation) { showToast("Geolocation is not supported.", 'error'); return; }

        const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
        navigator.geolocation.getCurrentPosition(async (position: any) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // --- CAMPUS COORDINATES ---
            const targetLat = event.latitude || 9.306;
            const targetLng = event.longitude || 123.306;
            const MAX_DISTANCE_METERS = 200; // Realistic campus radius

            // Haversine Formula
            const R = 6371e3;
            const f1 = userLat * Math.PI / 180;
            const f2 = targetLat * Math.PI / 180;
            const Δφ = (targetLat - userLat) * Math.PI / 180;
            const Δλ = (targetLng - userLng) * Math.PI / 180;
            const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(f1) * Math.cos(f2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;

            if (distance > MAX_DISTANCE_METERS) {
                showToast(`You are too far from the venue (${Math.round(distance)}m).`, 'error');
                return;
            }

            try {
                const now = new Date().toISOString();
                const { data, error } = await supabaseClient.from('event_attendance')
                    .update({ time_out: now })
                    .eq('event_id', event.id)
                    .eq('student_id', personalInfo.studentId)
                    .select();

                if (error) throw error;
                if (!data || data.length === 0) {
                    showToast("No attendance record found. Please time in first.", 'error');
                    return;
                }
                setAttendanceMap((prev: any) => ({ ...prev, [event.id]: data[0] }));
                showToast("Time Out Successful!");
                fetchHistory();
            } catch (err: any) {
                console.error("Time Out Error:", err);
                showToast("Error: " + err.message, 'error');
            }
        }, (error: any) => {
            showToast("Location check failed. Please enable location services.", 'error');
        }, options);
    };

    const handleRateEvent = (event: any) => {
        setRatingForm({
            eventId: event.id, title: event.title, rating: 0, comment: '',
            q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0,
            open_best: '', open_suggestions: '', open_comments: '',
            date_of_activity: event.event_date || event.created_at || new Date().toISOString()
        });
        setShowRatingModal(true);
    };

    const submitRating = async () => {
        const scores = [ratingForm.q1, ratingForm.q2, ratingForm.q3, ratingForm.q4, ratingForm.q5, ratingForm.q6, ratingForm.q7];
        if (scores.some(s => s === 0)) { showToast("Please rate all evaluation criteria", 'error'); return; }
        if (ratedEvents.includes(ratingForm.eventId)) { showToast("You have already rated this event.", 'error'); setShowRatingModal(false); return; }

        const avgRating = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        try {
            const { error } = await supabaseClient.from('event_feedback').insert([{
                event_id: ratingForm.eventId,
                student_id: personalInfo.studentId,
                student_name: `${personalInfo.firstName} ${personalInfo.lastName}`,
                rating: avgRating,
                feedback: ratingForm.comment,
                submitted_at: new Date().toISOString(),
                sex: personalInfo.sex || personalInfo.gender || '',
                college: `${personalInfo.department || ''} - ${personalInfo.course || ''} (${personalInfo.year || ''})`,
                date_of_activity: ratingForm.date_of_activity ? new Date(ratingForm.date_of_activity).toISOString().split('T')[0] : null,
                q1_score: ratingForm.q1,
                q2_score: ratingForm.q2,
                q3_score: ratingForm.q3,
                q4_score: ratingForm.q4,
                q5_score: ratingForm.q5,
                q6_score: ratingForm.q6,
                q7_score: ratingForm.q7,
                open_best: ratingForm.open_best,
                open_suggestions: ratingForm.open_suggestions,
                open_comments: ratingForm.open_comments
            }]);
            if (error) throw error;
            setRatedEvents([...ratedEvents, ratingForm.eventId]);
            showToast("Evaluation submitted successfully!"); setShowRatingModal(false);
        } catch (err: any) { showToast("Error: " + err.message, 'error'); }
    };

    const colorMap = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', hoverBg: 'group-hover:bg-blue-600' },
        green: { bg: 'bg-green-50', text: 'text-green-600', hoverBg: 'group-hover:bg-green-600' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', hoverBg: 'group-hover:bg-purple-600' }
    };

    const handleInventoryChange = (questionId: any, value: any) => {
        setAssessmentForm((prev: any) => {
            const parsed = typeof value === 'number' ? value : (isNaN(Number(value)) ? value : parseInt(value));
            return { ...prev, responses: { ...prev.responses, [questionId]: parsed } };
        });
    };

    const openAssessmentForm = async (form: any) => {
        if (completedForms.has(form.id)) {
            showToast('You have already completed this assessment.', 'error');
            return;
        }
        setActiveForm(form);
        setAssessmentForm({ responses: {}, other: '' });
        setFormQuestions([]);
        setShowAssessmentModal(true);
        const { data: qs } = await supabaseClient.from('questions').select('*').eq('form_id', form.id).order('order_index');
        setFormQuestions(qs || []);
    };

    const submitAssessment = async () => {
        if (!activeForm) return;
        setIsSubmitting(true);
        try {
            const { data: subData, error: subError } = await supabaseClient
                .from('submissions')
                .insert([{ form_id: activeForm.id, student_id: personalInfo.studentId, submitted_at: new Date().toISOString() }])
                .select().single();
            if (subError) throw subError;
            const answersPayload = Object.entries(assessmentForm.responses).map(([qId, val]) => ({ submission_id: subData.id, question_id: parseInt(qId), answer_value: val }));
            if (answersPayload.length > 0) {
                const { error: ansError } = await supabaseClient.from('answers').insert(answersPayload);
                if (ansError) throw ansError;
            }
            setShowAssessmentModal(false);
            setShowSuccessModal(true);
            setAssessmentForm({ responses: {}, other: '' });
            setCompletedForms((prev: any) => new Set([...prev, activeForm.id]));
        } catch (error: any) {
            showToast("Error submitting assessment: " + error.message, 'error');
        } finally { setIsSubmitting(false); }
    };

    const submitCounselingRequest = async () => {
        if (!counselingForm.reason_for_referral.trim()) { showToast("Please provide your reason for requesting counseling.", 'error'); return; }
        setIsSubmitting(true);
        try {
            const { error } = await supabaseClient.from('counseling_requests').insert([{
                student_id: personalInfo.studentId,
                student_name: `${personalInfo.firstName} ${personalInfo.lastName}`,
                course_year: `${personalInfo.course || ''} - ${personalInfo.year || ''}`,
                contact_number: personalInfo.mobile || '',
                request_type: 'Self-Referral',
                description: counselingForm.reason_for_referral,
                reason_for_referral: counselingForm.reason_for_referral,
                personal_actions_taken: counselingForm.personal_actions_taken,
                date_duration_of_concern: counselingForm.date_duration_of_concern,
                department: personalInfo.department,
                status: 'Submitted'
            }]);
            if (error) throw error;
            showToast("Counseling Request Submitted!");
            setShowCounselingForm(false);
            setCounselingForm({ reason_for_referral: '', personal_actions_taken: '', date_duration_of_concern: '' });
        } catch (error: any) {
            showToast("Error: " + error.message, 'error');
        } finally { setIsSubmitting(false); }
    };

    const submitSupportRequest = async () => {
        if (supportForm.categories.length === 0 && !supportForm.otherCategory) { showToast("Please select at least one category.", 'error'); return; }
        setIsSubmitting(true);
        try {
            let docUrl = null;
            if (supportForm.file) {
                const fileExt = supportForm.file.name.split('.').pop();
                const fileName = `${personalInfo.studentId}_support_${Date.now()}.${fileExt}`;
                const { data: uploadData, error: uploadError } = await supabaseClient.storage.from('support_documents').upload(fileName, supportForm.file);
                if (uploadError) throw uploadError;
                const { data: publicUrlData } = supabaseClient.storage.from('support_documents').getPublicUrl(fileName);
                docUrl = publicUrlData.publicUrl;
            }
            const description = `[Q1 Description]: ${supportForm.q1}\n[Q2 Previous Support]: ${supportForm.q2}\n[Q3 Required Support]: ${supportForm.q3}\n[Q4 Other Needs]: ${supportForm.q4}`.trim();
            const finalCategories = [...supportForm.categories];
            if (supportForm.otherCategory) finalCategories.push(`Other: ${supportForm.otherCategory}`);
            const { error } = await supabaseClient.from('support_requests').insert([{ student_id: personalInfo.studentId, student_name: `${personalInfo.firstName} ${personalInfo.lastName}`, department: personalInfo.department, support_type: finalCategories.join(', '), description: description, documents_url: docUrl, status: 'Submitted' }]);
            if (error) throw error;
            showToast("Support Request Submitted!");
            setShowSupportModal(false);
            setSupportForm({ categories: [], otherCategory: '', q1: '', q2: '', q3: '', q4: '', file: null });
        } catch (error: any) {
            showToast("Error: " + error.message, 'error');
        } finally { setIsSubmitting(false); }
    };

    const openRequestModal = (req: any) => {
        setSelectedRequest(req);
        setSessionFeedback({ rating: req.rating || 0, comment: req.feedback || '' });
    };

    const submitSessionFeedback = async () => {
        if (sessionFeedback.rating === 0) { showToast("Please select a rating.", 'error'); return; }
        try {
            const { error } = await supabaseClient.from('counseling_requests').update({ rating: sessionFeedback.rating, feedback: sessionFeedback.comment }).eq('id', selectedRequest.id);
            if (error) throw error;
            showToast("Feedback submitted!");
            const updatedReq = { ...selectedRequest, rating: sessionFeedback.rating, feedback: sessionFeedback.comment };
            setCounselingRequests(prev => prev.map(r => r.id === selectedRequest.id ? updatedReq : r));
            setSelectedRequest(updatedReq);
        } catch (err: any) { showToast("Error: " + err.message, 'error'); }
    };

    const handleOfficeTimeIn = async () => { setShowTimeInModal(true); };

    const submitTimeIn = async () => {
        if (!selectedReason) { showToast("Please select a reason.", 'error'); return; }
        try {
            const { data, error } = await supabaseClient.from('office_visits').insert([{ student_id: personalInfo.studentId, student_name: `${personalInfo.firstName} ${personalInfo.lastName}`, reason: selectedReason, status: 'Ongoing' }]).select().single();
            if (error) throw error;
            setActiveVisit(data);
            showToast("You have Timed In at the office.");
            setShowTimeInModal(false);
        } catch (err: any) { showToast(err.message, 'error'); }
    };

    const handleOfficeTimeOut = async () => {
        if (!activeVisit) return;
        await supabaseClient.from('office_visits').update({ time_out: new Date().toISOString(), status: 'Completed' }).eq('id', activeVisit.id);
        setActiveVisit(null);
        showToast("You have Timed Out. Thank you for visiting!");
    };

    const sidebarLinks = [
        { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard, group: 'Core' },
        { id: 'profile', label: 'My Profile', icon: Icons.Profile, group: 'Core' },
        { id: 'assessment', label: 'Needs Assessment', icon: Icons.Assessment, group: 'Academic' },
        { id: 'counseling', label: 'Counseling', icon: Icons.Counseling, group: 'Services' },
        { id: 'support', label: 'Additional Support', icon: Icons.Support, group: 'Services' },
        { id: 'scholarship', label: 'Scholarship', icon: Icons.Scholarship, group: 'Services' },
        { id: 'events', label: 'Events', icon: Icons.Events, group: 'Activities' },
        { id: 'feedback', label: 'Feedback', icon: Icons.Feedback, group: 'Activities' }
    ];

    // --- LOADING STATE ---
    if (loading) {
        return { loading } as any;
    }


    // --- AUTHENTICATED MAIN RENDER ---
    const viewLabels = { dashboard: 'Dashboard', profile: 'My Profile', assessment: 'Needs Assessment', counseling: 'Counseling', support: 'Additional Support', scholarship: 'Scholarship', events: 'Events', feedback: 'Feedback' };

    // --- ONBOARDING TOUR DATA ---
    const TOUR_STEPS = [
        {
            title: "Welcome to your Student Portal! 👋",
            description: "This is your central hub for all student services, assessments, and essential information. Let's take a quick look around.",
            icon: <Icons.Star filled />,
            highlightId: null
        },
        {
            title: "Needs Assessment Test (NAT)",
            description: "The NAT helps us understand your needs better. You can take the test and view your results here.",
            icon: <Icons.Assessment />,
            highlightId: "nav-assessment"
        },
        {
            title: "Counseling Services",
            description: "Need someone to talk to? Request an appointment with our counseling staff easily through this tab.",
            icon: <Icons.Counseling />,
            highlightId: "nav-counseling"
        },
        {
            title: "Events & Announcements",
            description: "Stay updated with the latest workshops, seminars, and important school announcements.",
            icon: <Icons.Events />,
            highlightId: "nav-events"
        },
        {
            title: "Your Profile",
            description: "Keep your personal information up to date so we can serve you better. Click here to edit your details.",
            icon: <Icons.Profile />,
            highlightId: "nav-profile"
        },
        {
            title: "You're All Set! 🚀",
            description: "Feel free to explore the portal at your own pace. If you ever need help, the Support tab is right there.",
            icon: <Icons.CheckCircle />,
            highlightId: null
        }
    ];

    const currentTourStep = TOUR_STEPS[tourStep];
    const highlightedElement = currentTourStep?.highlightId ? document.getElementById(currentTourStep.highlightId) : null;
    const highlightRect = highlightedElement ? highlightedElement.getBoundingClientRect() : null;

    const handleTourNext = async () => {
        if (tourStep < TOUR_STEPS.length - 1) {
            setTourStep(prev => prev + 1);
        } else {
            setShowTour(false);
            setHasSeenTourState(true);
            try {
                await supabaseClient.from('students').update({ has_seen_tour: true }).eq('student_id', personalInfo.studentId);
            } catch (err) {
                console.error("Failed to save tour completion.", err);
            }
        }
    };

    const p = {
        activeView,
        activeForm,
        loadingForm,
        formQuestions,
        formsList,
        assessmentForm,
        handleInventoryChange,
        submitAssessment,
        openAssessmentForm,
        showAssessmentModal,
        setShowAssessmentModal,
        showSuccessModal,
        setShowSuccessModal,
        isSubmitting,
        showCounselingForm,
        setShowCounselingForm,
        counselingForm,
        setCounselingForm,
        submitCounselingRequest,
        counselingRequests,
        openRequestModal,
        selectedRequest,
        setSelectedRequest,
        formatFullDate,
        sessionFeedback,
        setSessionFeedback,
        submitSessionFeedback,
        Icons,
        supportRequests,
        showSupportModal,
        setShowSupportModal,
        showCounselingRequestsModal,
        setShowCounselingRequestsModal,
        showSupportRequestsModal,
        setShowSupportRequestsModal,
        supportForm,
        setSupportForm,
        personalInfo,
        submitSupportRequest,
        showScholarshipModal,
        setShowScholarshipModal,
        selectedScholarship,
        setSelectedScholarship,
        feedbackType,
        setFeedbackType,
        rating,
        setRating,
        profileTab,
        setProfileTab,
        isEditing,
        setIsEditing,
        setPersonalInfo,
        saveProfileChanges,
        handleProfilePictureUpload,
        isUploadingProfilePicture,
        attendanceMap,
        showMoreProfile,
        setShowMoreProfile,
        showCommandHub,
        setShowCommandHub,
        completedForms,
        scholarshipsList,
        myApplications,
        handleApplyScholarship,
        isSidebarOpen,
        setIsSidebarOpen,
        sidebarLinks,
        setActiveView,
        notifications,
        activeVisit,
        handleOfficeTimeOut,
        handleOfficeTimeIn,
        colorMap,
        eventsList,
        eventFilter,
        setEventFilter,
        fetchHistory,
        setSelectedEvent,
        selectedEvent,
        isTimingIn,
        setProofFile,
        handleTimeIn,
        handleTimeOut,
        ratedEvents,
        handleRateEvent,
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
        handleProfileCompletion,
        showTour,
        highlightRect,
        currentTourStep,
        TOUR_STEPS,
        tourStep,
        handleTourNext,
        showRatingModal,
        setShowRatingModal,
        ratingForm,
        setRatingForm,
        submitRating,
        showTimeInModal,
        setShowTimeInModal,
        visitReasons,
        selectedReason,
        setSelectedReason,
        submitTimeIn,
        toast
    };

    return {
        loading,
        p,
        viewLabels
    };
}
