import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateGrammarDto } from './dto/create-grammar.dto';
import { UpdateGrammarDto } from './dto/update-grammar.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Grammar} from "./entities/grammar.entity";
import {Repository} from "typeorm";

@Injectable()
export class GrammarService {
    constructor(@InjectRepository(Grammar) private readonly grammarRepository: Repository<Grammar>,
    ) {
    }
  public async create(createGrammarDto: CreateGrammarDto) {
        try {
            const grammar = await this.grammarRepository.create({
                content: createGrammarDto.content,
                title: createGrammarDto.title,
            });

            return await this.grammarRepository.save(grammar);
        } catch (e) {
            throw new BadRequestException('Failed to create grammar ');
        }
  }

  public async findAll() {
        try {
            return await this.grammarRepository.find();
        } catch (e) {
            throw new BadRequestException('could not found grammar');
        }
  }


  public async findOne(id: string) {
        return await this.grammarRepository.findOne({
            where: {
                id
            }
        });
  }

}
