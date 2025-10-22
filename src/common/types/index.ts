export enum Role {
    Unauthorized, 
    Authorized, 
    Administrator,
}

export enum Status {
    Unapproved, 
    Active, 
    Banned,
}

export interface Picture {
    path: string;
}

export interface Message {
    id: number;
    authorId: number; 
    content: string;
}

export interface User {
    id: number; 
    name: string; 
    email: string; 
    birth: string;
    photo?: Picture;
    role: Role;
    status: Status;
}