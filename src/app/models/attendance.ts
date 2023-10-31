export interface Attendance {
    ok:   boolean;
    data: DatumAttendance[];
}

export interface SingleAttendance {
    ok: boolean;
    data: DatumAttendance;
}

export interface DatumAttendance {
    _id?:              string;
    date:             Date | string;
    courseId:         string;
    codeSubject:      string;
    studentIds:       StudentID[];
    subjectTeacherId: string;
    __v?:              number;
}

export interface StudentID {
    attendanceStatus: AttendanceStatus;
    studentId:        string;
    _id:              string;
}

export enum AttendanceStatus {
    Ausente = "Ausente",
    Presente = "Presente",
}
