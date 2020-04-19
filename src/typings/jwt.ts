import { UserDocument } from "../models/user";

export interface UserPayload {
    id: UserDocument['_id']
}