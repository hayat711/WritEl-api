import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateNotificationDto} from './dto/create-notification.dto';
import {UpdateNotificationDto} from './dto/update-notification.dto';
import {User} from "../user/entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Notification} from "./entities/notification.entity";
import {Repository} from "typeorm";

@Injectable()
export class NotificationService {
  constructor(@InjectRepository(Notification) private readonly notificationRepository: Repository<Notification>,
              ) {
  }
  public async create(user: User ,createNotificationDto: CreateNotificationDto) {
    try {
      const { title, message , } = createNotificationDto;
      const notification = await this.notificationRepository.create({
        title: title,
        message: message,
        owner: user,
      });
      return await this.notificationRepository.save(notification);
    } catch (e) {
      console.log('error creating notification', e);
      throw new InternalServerErrorException(e);
    }
  }


  async findAll() {
    try{
      return await this.notificationRepository.find();
    } catch (e) {
      console.log('error finding all notifications', e);
    }
  }

  async findOne(id: string) {
    try {
      const notification = await this.notificationRepository.findOne({
        where: {
          id
        }
      })
      return notification
    } catch (e) {
      console.log('error ', e);
    }
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
