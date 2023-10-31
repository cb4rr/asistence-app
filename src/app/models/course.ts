export interface Course {
    ok:   boolean;
    data: DatumCourse[];
}

export interface SingleCourse {
    ok: boolean;
    data: DatumCourse;
}

export interface DatumCourse {
    _id:          string;
    courseName:   string;
    scheduleId:   string;
    modality:     string;
    studentArray: string[];
    __v:          number;
}
