import { PartialType } from '@nestjs/swagger';
import { CreateWritingDto } from './create-writing.dto';

export class UpdateWritingDto extends PartialType(CreateWritingDto) {}
