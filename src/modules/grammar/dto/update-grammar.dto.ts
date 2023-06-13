import { PartialType } from '@nestjs/swagger';
import { CreateGrammarDto } from './create-grammar.dto';

export class UpdateGrammarDto extends PartialType(CreateGrammarDto) {}
