import {IsNotEmpty, IsString} from "class-validator";

export class CreateHistoryDto {

    @IsString()
    title: string;


    @IsString()
    @IsNotEmpty()
    content: string;

}
