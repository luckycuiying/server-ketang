import { UserDocument } from "../models/user";
declare global {
    namespace Express {
        export interface Request {
            currentUser?: UserDocument | null;
            file: Multer.File
        }
    }
}