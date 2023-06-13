import {IsNotEmpty, IsString} from "class-validator";

export class CreateGrammarDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    title?: string;

}
