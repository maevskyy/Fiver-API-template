export interface IInternalError {
    errorCode: string;
    errorMessage: string;
}

export interface IDBUser {
    id: string;
    name: string;
    email: string;
    password: string;
}