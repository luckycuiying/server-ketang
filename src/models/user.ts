import mongoose, { Schema, Model, Document, HookNextFunction } from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../typings/jwt';
import bcrypt from 'bcryptjs';
export interface UserDocument extends Document {
    username: string,
    password: string,
    email: string;
    avatar: string;
    generateToken: () => string,
    _doc: UserDocument
}
const UserSchema: Schema<UserDocument> = new Schema({
    username: {
        type: String,
        required: [true, '用户名不能为空'],
        minlength: [6, '最小长度不能少于6位'],
        maxlength: [12, '最大长度不能大于12位']
    },
    password: String,
    avatar: String,
    email: {
        type: String,
        validate: {
            validator: validator.isEmail
        },
        trim: true,
    }
}, { timestamps: true ,    toJSON: {
        transform: function (_doc: any, result: any) {
            result.id = result._id;
            delete result._id;
            delete result.__v;
            delete result.password;
            delete result.createdAt;
            delete result.updatedAt;
            return result;
        }
    }});

UserSchema.methods.generateToken = function (): string {
    let payload: UserPayload = ({ id: this.id });
    return jwt.sign(payload, 'tao.xu', { expiresIn: '1h' });
}
UserSchema.pre<UserDocument>('save', async function (next: HookNextFunction) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});
UserSchema.static('login', async function (this: any, username: string, password: string): Promise<UserDocument | null> {
    let user: UserDocument | null = await this.model('User').findOne({ username });
    if (user) {
        const matched = await bcrypt.compare(password, user.password);
        if (matched) {
            return user;
        } else {
            return null;
        }
    }
    return user;
});
interface IUserModel<T extends Document> extends Model<T> {
    login: (username: string, password: string) => UserDocument | null
}
export const User: IUserModel<UserDocument> = mongoose.model<UserDocument, IUserModel<UserDocument>>('User', UserSchema);