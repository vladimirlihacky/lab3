import { Role, Status, type Picture } from "../types";

export function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validateISODate(date: string) {
    const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
    return isoRegex.test(date) && !isNaN(Date.parse(date));
}

export function validatePath(path: string) {
    const pathRegex = /^[a-zA-Z0-9/._-]+$/;
    return pathRegex.test(path) && path.length > 0;
}

export function validatePicture(picture: Picture) {
    return picture.path && validatePath(picture.path);
}

export function validateRole(role: Role) {
    return Object.values(Role).includes(role);
}

export function validateStatus(status: Status) {
    return Object.values(Status).includes(status);
}