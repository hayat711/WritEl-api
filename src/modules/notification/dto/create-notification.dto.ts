import {IsString} from "class-validator";
import {User} from "../../user/entities/user.entity";

export class CreateNotificationDto {

    @IsString()
    title?:string;

    @IsString()
    message?:string;

    user?:User
}
