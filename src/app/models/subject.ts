export interface Subject {
    ok:   boolean;
    data: DatumSubject[];
}

export interface SingleSubject {
    ok: boolean;
    data: DatumSubject;
}

export interface DatumSubject {
    _id:         string;
    nameSubject: string;
    teacherId:   string;
    __v:         number;
    codeSubject: string;
}
