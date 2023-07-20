import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    description: string


    @IsNotEmpty()
    content: string

    @IsOptional()
    @IsNumber()
    likes: number;

    @IsOptional()
    @IsNumber()
    dislikes: number;

    @IsOptional()
    @IsNumber()
    views: number;

    

}
