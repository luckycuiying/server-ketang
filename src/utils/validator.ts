import validator from 'validator';
import { UserDocument } from '../models/user';

export interface RegisterInput extends Partial<UserDocument> {
    confirmPassword?: string;
}

export interface RegisterInputValidateResult {
    errors: RegisterInput,
    valid: boolean
}

export const validateRegisterInput = (
    username: string,
    password: string,
    confirmPassword: string,
    email: string
): RegisterInputValidateResult => {
    let errors: RegisterInput = {};
    if (username == undefined || validator.isEmpty(username)) {
        errors.username = '用户名不能为空';
    }
    if (password == undefined || validator.isEmpty(password)) {
        errors.password = '密码不能为空';
    }
    if (confirmPassword == undefined || validator.isEmpty(confirmPassword)) {
        errors.password = '确认密码不能为空';
    }
    if (!validator.equals(password, confirmPassword)) {
        errors.confirmPassword = '确认密码和密码不相等';
    }
    if (email == undefined || validator.isEmpty(password)) {
        errors.email = '邮箱不能为空';
    }
    if (validator.isEmail(password)) {
        errors.email = '邮箱格式必须合法';
    }
    return { errors, valid: Object.keys(errors).length == 0 };
}