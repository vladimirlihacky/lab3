import * as types from "../../common/types"
import { Model } from ".";

export class Message extends Model implements types.Message {
    public authorId: number = -1;
    public content: string = "";
    
    public static validate(data: any): Boolean {
        return Boolean(
            !isNaN(data.authorId)
            && typeof data.content === "string" && data.content !== ""
        )
    }
}