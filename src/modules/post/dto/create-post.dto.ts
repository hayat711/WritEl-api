import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    description: string


    @IsNotEmpty()
    content: string

    @IsNumber()
    likes: number;

    @IsNumber()
    dislikes: number;

    @IsNumber()
    views: number;
}
