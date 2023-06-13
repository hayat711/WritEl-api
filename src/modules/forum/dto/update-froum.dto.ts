import { PartialType } from '@nestjs/swagger';
import {CreateForumDto} from "./create-froum.dto";

export class UpdateForumDto extends PartialType(CreateForumDto) {}
