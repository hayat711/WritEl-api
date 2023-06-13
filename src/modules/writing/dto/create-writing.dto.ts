import {IsString} from "class-validator";

export class CreateWritingDto {

    @IsString()
    title : string;

    @IsString()
    content : string;

}
