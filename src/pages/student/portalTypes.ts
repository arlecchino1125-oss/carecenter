export interface Student {
    firstName: string;
    lastName: string;
    middleName?: string;
    suffix?: string;
    studentId: string;
    department: string;
    course: string;
    year: string;
    section: string;
    status: string;
    address: string;
    street?: string;
    city?: string;
    province?: string;
    zipCode?: string;
    mobile: string;
    email: string;
    facebookUrl?: string;
    emergencyContact?: string;
    dob: string;
    age: string | number;
    placeOfBirth?: string;
    sex: string;
    gender?: string;
    genderIdentity?: string;
    civilStatus?: string;
    nationality?: string;
    priorityCourse?: string;
    altCourse1?: string;
    altCourse2?: string;
    schoolLastAttended?: string;
    isWorkingStudent?: boolean;
    workingStudentType?: string;
    supporter?: string;
    supporterContact?: string;
    isPwd?: boolean;
    pwdType?: string;
    isIndigenous?: boolean;
    indigenousGroup?: string;
    witnessedConflict?: string;
    isSoloParent?: boolean;
    isChildOfSoloParent?: boolean;
    [key: string]: any; // Allow loose typing for now to prevent breakage
}

export interface Event {
    id: string;
    title: string;
    description?: string;
    event_date: string;
    event_time: string;
    end_time?: string;
    location: string;
    type: string;
}

export interface Scholarship {
    id: string;
    title: string;
    description: string;
    requirements: string;
    deadline: string;
}

export interface Request {
    id: string;
    status: string;
    created_at: string;
    student_name?: string;
    course_year?: string;
    contact_number?: string;
    reason_for_referral?: string;
    description?: string;
    personal_actions_taken?: string;
    date_duration_of_concern?: string;
    referred_by?: string;
    scheduled_date?: string;
    resolution_notes?: string;
    rating?: number;
    feedback?: string;
    support_type?: string;
    [key: string]: any;
}
