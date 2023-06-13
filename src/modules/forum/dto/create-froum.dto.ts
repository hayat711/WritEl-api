import {IsNotEmpty, IsString} from "class-validator";
import {ForumCategory} from "../../../common/enums/forum.category.enum";

export class CreateForumDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    category: ForumCategory;


}
