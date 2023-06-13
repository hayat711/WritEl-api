import {Module} from '@nestjs/common';
import {NotificationService} from './notification.service';
import {NotificationController} from './notification.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Notification} from "./entities/notification.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [TypeOrmModule.forFeature([Notification]), AuthModule]
})
export class NotificationModule {}
