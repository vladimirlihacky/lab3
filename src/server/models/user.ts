import * as types from "../../common/types"
import { validateEmail, validateISODate, validatePicture, validateRole } from "../../common/validators";
import { Model } from ".";

export class User extends Model implements types.User {
    public name: string = "";
    public birth: string = "";
    public email: string = "";
    public password: string = "";
    public photo?: types.Picture;
    public status: types.Status = types.Status.Unapproved;
    public role: types.Role = types.Role.User;

    public friendIds: number[] = [];
    public messageIds: number[] = [];

    public static validate(data: any): Boolean {
        return Boolean(
            data &&
            // true ||
            validateEmail(data.email)
            && validateISODate(data.birth)
            && (data.photo ? validatePicture(data.photo!) : true)
            && typeof data.name === "string" && data.name !== ""
            && typeof data.password === "string" && data.password !== ""
        )
    }
}