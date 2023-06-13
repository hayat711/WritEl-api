import {AbstractEntity} from "../../../common/entities/abstract.entitiy";
import {Column, Entity, ManyToOne} from "typeorm";
import {NotificationEnum} from "../../../common/enums/notification.enum";
import {User} from "../../user/entities/user.entity";


@Entity()
export class Notification extends AbstractEntity<Notification>{

    @Column({
        nullable: true
    })
    title: string;

    @Column({
        nullable: true
    })
    message: string;


    @Column({
        type: 'enum',
        enum: NotificationEnum,
        default: NotificationEnum.DELIVERED,
        name: 'notification_status',
        nullable: false,
    })
    status: NotificationEnum;

    @ManyToOne(() => User, user => user.notifications, {
    })
    owner: User;

}
