export interface User {
    ok:   boolean;
    data: DatumUser[];
}

export interface SingleUser {
    ok: boolean;
    data: DatumUser;    
}

export interface DatumUser {
    _id:          string;
    userId:       string;
    userEmail:    string;
    userPassword: string;
    userName:     string;
    userLastName: string;
    userRole:     UserRole;
    userBornDate: Date;
    userPhone:    string;
    __v:          number;
}

export enum UserRole {
    Alumno = "alumno",
    Profesor = "profesor",
}
