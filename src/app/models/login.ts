export interface Login {
    ok:   boolean;
    data: DataLogin;
}

export interface DataLogin {
    _id:          string;
    userName:     string;
    userLastName: string;
}
