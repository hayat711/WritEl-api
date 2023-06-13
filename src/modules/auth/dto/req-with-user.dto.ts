import {Request} from "express";
import {User} from "../../user/entities/user.entity";


interface RequestWithUser extends Request {
    user: User
}
export default RequestWithUser;



export interface IUser extends User {
    verified?: boolean;
}

export interface AuthRequest extends Request {
    user: IUser
}
