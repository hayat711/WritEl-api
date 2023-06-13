import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import {AbstractEntity} from "../../../common/entities/abstract.entitiy";
import {Message} from "../../message/entities/message.entity";
import {User} from "../../user/entities/user.entity";
import {Invitation} from "./invitation.entity";


@Entity()
export class Room extends AbstractEntity<Room>{

    @Column({ unique: true })
    public name : string;

    @Column({ nullable: true})
    public description: string;

    @Column({
        type: 'boolean',
        default: true,
    })
    public isPublic: boolean;

    @ManyToMany(() => User)
    @JoinTable()
    public users: User[];

    @ManyToMany(() => User)
    @JoinTable()
    public mods: User[];

    @ManyToOne(() => User)
    @JoinTable()
    public owner: User;


    @OneToMany(() => Message,
        message => message.room, { onDelete : 'CASCADE'})
    public messages: Message[];

    @OneToMany(() => Invitation, invitation =>
        invitation.room, { onDelete: 'CASCADE'})
    public invitation: Invitation;
}
