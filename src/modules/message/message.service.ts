import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Message} from "./entities/message.entity";
import {RoomService} from "../room/room.service";
import {ConversationService} from "../conversation/conversation.service";
import {User} from "../user/entities/user.entity";
import {FindOperator, Repository} from "typeorm";

@Injectable()
export class MessageService {
  constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>,
              private readonly roomService: RoomService,
              private readonly conversationService: ConversationService) {
  }

  public async create( user : User | null , type: 'room' | 'conversation', id: string, text:string) {
    try {
      let chat: any;

      if (type === 'room') {
        chat = await this.roomService.getRoom(id, { relationIds: false});
      }else if (type === 'conversation') {
        chat = await this.conversationService.getConversation(id);
      }

      if (user) {
        let message: Message;
        if (type === 'room') {
          message = this.messageRepository.create({
            author: user,
            room: chat,
            text
          })
        } else if (type === 'conversation') {
          message = this.messageRepository.create({
            author: user,
            conversation: chat,
            text
          })
        }
        return this.messageRepository.save(message);
      }

      if(!user) {
        let message: Message;
        if (type === 'room') {
          message = this.messageRepository.create({
            room: chat,
            text
          })
        } else if (type === 'conversation') {
          message = this.messageRepository.create({
            conversation: chat,
            text
          })
        }
        return this.messageRepository.save(message);
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async getUrls(text: string) {
    const exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?!&//=]*)/gi
    const result = text.match(exp);

    if(!result) {
      return [];
    }

    return Array.from(result);
  }

  public async getUserMessages(user: any | FindOperator<User>) {
    try {
      const query = await this.messageRepository
          .createQueryBuilder('message')
          .where('author.id = :authorId', { authorId: user.id})
          .leftJoinAndSelect('message.author', 'author')
          .leftJoinAndSelect('message.room', 'room')
          .select([
              'message',
              'author.id',
              'author.displayName',
              'room.id',
              'room.name'
          ])
          .orderBy('message.created_at', 'DESC')
          .getMany();
      return query;
    } catch (err) {
      console.log(err);
    }
  }

  public async findMessagesForRoom(roomId: string): Promise<any> {
    const room = await this.roomService.getRoom(roomId, { relationIds: true});
    const query = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoin('message.room', 'room')
        .where('room.id = :roomId', { roomId: room.id})
        .leftJoinAndSelect('message.author', 'author')
        .select([
            'message',
            'author.id',
            'author.displayName',
            'room.id',
            'room.name'
        ])
        .orderBy('message.created_at', 'DESC')
        .getMany();
    return query;
  }

  async findMessagesForConversation(conversationId: string) : Promise<any> {
    const conversation = await this.conversationService.getConversation(conversationId);
    const query = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoin('message.conversation', 'conversation')
        .where('conversation.id = :conversationId', { conversationId: conversation.id})
        .leftJoinAndSelect('message.author', 'author')
        .select([
            'message',
            'author.id',
            'author.displayName',
            'conversation.id'
        ])
        .orderBy('message.created_at', 'DESC')
        .getMany();
    return query;
  }


}
