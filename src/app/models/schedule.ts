export interface Schedule {
    ok:   boolean;
    data: DatumSchedule[];
}

export interface SingleSchedule {
    ok: boolean;
    data: DatumSchedule;
}

export interface DatumSchedule {
    _id:       string;
    __v:       number;
    schedules: Schedules[];
}

export interface Schedules {
    nameSubject: string;
    dayOfWeek:   string;
    timeSlots:   TimeSlot[];
    courseId:    string;
    teacherId:   string;
    _id:         string;
}

export interface TimeSlot {
    startTime: string;
    endTime:   string;
    _id:       string;
}