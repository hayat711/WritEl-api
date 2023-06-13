import {Column, Entity, JoinTable, ManyToOne} from "typeorm";
import {AbstractEntity} from "../../../common/entities/abstract.entitiy";
import {Room} from "../../room/entities/room.entity";
import {User} from "../../user/entities/user.entity";
import {Conversation} from "../../conversation/entities/conversation.entity";

@Entity()
export class Message extends AbstractEntity<Message>{

    @ManyToOne(() => Room,
        room => room.messages, { onDelete: 'CASCADE', nullable: true})
    @JoinTable()
    public room : Room;

    @ManyToOne(() => User,
        user => user.messages, { onDelete: 'CASCADE', nullable: true})
    public author: User;

    @ManyToOne(() => Conversation,
        conversation => conversation.messages, { onDelete: 'CASCADE', nullable: true})
    public conversation: Conversation

    @Column({
        name: 'text',
        nullable: false
    })
    public text: string;

    @Column({
        type: 'boolean',
        default: false
    })
    public edited: boolean;

    @Column({
        type: 'boolean',
        default: false,
    })
    public haveSeen: boolean;


}
