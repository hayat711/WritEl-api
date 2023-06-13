import {Injectable} from '@nestjs/common';
import {CreateWritingDto} from './dto/create-writing.dto';
import {UpdateWritingDto} from './dto/update-writing.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Writing} from "./entities/writing.entity";
import {Repository} from "typeorm";

@Injectable()
export class WritingService {
  constructor(
      @InjectRepository(Writing) private readonly writingRepository: Repository<Writing>,
  ) {
  }


  async createDocument(userId: string, createWritingDto: CreateWritingDto) {
    try {
      const {title, content} = createWritingDto;
      const newDocument = await this.writingRepository.create({
        author: { id: userId},
        title,
        content,
      });
      await this.writingRepository.save(newDocument);
    } catch (e) {
      console.log(e.message());
      throw  new Error(e);
    }
  }

  async getAllDocuments() {
    try {
      return await this.writingRepository.find();
    }catch (e) {
      console.log(e.message());
      throw new Error(e);
    }
  }

  async getDocument(userId: string, id: string) {
    try {
      const document = await this.writingRepository.findOne({
        where: { author : { id : userId}}
      });
      return document;
    } catch (e) {
      console.log(e.message());
      throw new Error(e);
    }
  }

  async updateDocument(id: string, updateWritingDto: UpdateWritingDto) {
    try {
      const document = await this.writingRepository.findOne({ where: { id}});
      if (!document) {
        throw new Error('document not found');
      }
      const updatedDocument = await this.writingRepository.update(id, updateWritingDto);
      if(updatedDocument.affected === 0) {
        throw new Error('Failed to update document');
      }

      const updatedDoc = await this.writingRepository.findOne({ where: { id}});
      return updatedDoc;
    } catch (e) {
      console.log(e.message());
      throw new Error(e);
    }
  }

  async removeDocument(id: string) {
    try {
      return await this.writingRepository.delete(id);
    } catch (e) {
      console.log(e.message());
      throw new Error(e);
    }
  }
}
