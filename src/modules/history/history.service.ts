import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {History} from "./entities/history.entity";
import {Repository} from "typeorm";
import {UserService} from "../user/user.service";

@Injectable()
export class HistoryService {
  constructor(
      @InjectRepository(History) private readonly historyRepository: Repository<History>,
  ) {}

  public async createHistory(userId: string, createHistoryDto: CreateHistoryDto) {
    const { title, content } = createHistoryDto;
    try {
      const history = await this.historyRepository.create({
        title: createHistoryDto.title,
        content: createHistoryDto.content,
        owner: {id : userId},
      });
      const newHistory = await this.historyRepository.save(history);
      return newHistory;
    }
    catch (e) {
      console.log(e);
    }
  }

  public async getAllHistories() {
    return await this.historyRepository.find();
  }

  async getHistory(id: string) {
    try {
      return await this.historyRepository.findOne({
        where: { id}
      });
    } catch (e) {
      console.log(e);
    }
  }

  async update(id: string, updateHistoryDto: UpdateHistoryDto) {
    try {
      const history = await this.historyRepository.findOne({
        where: {id}
      });
      const updatedHistory = await this.historyRepository.update(id, updateHistoryDto);
      return updatedHistory;
    } catch (e) {
      console.log(e);
    }
  }

  async remove(id: string) {
    try {
      const history = await this.historyRepository.findOne({
        where:{id: id}
      });
      if (history) {
        return await this.historyRepository.remove(history);
      } else {
        console.log('No history found by that id');
      }
    } catch (e) {
      console.log(e)
    }

  }
}
