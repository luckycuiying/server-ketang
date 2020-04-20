import { Request, Response, NextFunction } from 'express';
import { validateRegisterInput } from '../utils/validator';
import HttpException from '../exceptions/HttpException';
import { UNPROCESSABLE_ENTITY,UNAUTHORIZED } from 'http-status-codes';
import { UserDocument, User } from '../models/user';
import { UserPayload } from '../typings/jwt';
import jwt from 'jsonwebtoken';
// 客户端会把token放在请求头里发给服务器
export const validate = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    debugger
    if (authorization) {
        const access_token = authorization.split(' ')[1];//Bearer access_token
        if (access_token) {
            try {
                const userPayload: UserPayload = jwt.verify(access_token, process.env.JWT_SECRET_KEY || 'zhufeng') as UserPayload;
                const user: UserDocument | null = await User.findById(userPayload.id);
                if (user) {
                    res.json({
                        success: true,
                        data: user.toJSON()
                    })
                } else {
                    next(new HttpException(UNAUTHORIZED, '用户未找到'));
                }
            } catch (error) {
                next(new HttpException(UNAUTHORIZED, 'access_token不正确'));
            }
        } else {
            next(new HttpException(UNAUTHORIZED, 'access_token未提供'));
        }
    } else {
        next(new HttpException(UNAUTHORIZED, 'authorization未提供'));
    }
}
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { username, password, confirmPassword, email, addresses } = req.body;
        debugger
        const { valid, errors } = validateRegisterInput(username, password, confirmPassword, email);
        if (!valid) {
            throw new HttpException(UNPROCESSABLE_ENTITY, `参数验证失败!`, errors);
        }
        let user: UserDocument = new User({
            username,
            email,
            password,
            addresses
        });
        let oldUser: UserDocument | null = await User.findOne({ username: user.username });
        if (oldUser) {
            throw new HttpException(UNPROCESSABLE_ENTITY, `用户名重复!`);
        }
        await user.save();
        let token = user.generateToken();
        res.json({
            success: true,
            data: { token }
        });
    } catch (error) {
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { username, password } = req.body;
        let user = await User.login(username, password);
        if (user) {
            let token = user.generateToken();
            res.json({
                success: true,
                data: {
                    token
                }
            });
        } else {
            throw new HttpException(UNAUTHORIZED, `登录失败`);
        }
    } catch (error) {
        next(error);
    }
}
export const uploadAvatar = async (req: Request, res: Response) => {
    let { userId } = req.body;
    let avatar = `${req.protocol}://${req.headers.host}/uploads/${req.file.filename}`;
    await User.updateOne({ _id: userId }, { avatar });
    res.send({ success: true, data: avatar });
}