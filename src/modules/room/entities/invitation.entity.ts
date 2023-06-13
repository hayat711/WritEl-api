import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {AbstractEntity} from "../../../common/entities/abstract.entitiy";
import {User} from "../../user/entities/user.entity";
import {Room} from "./room.entity";


@Entity()
export class Invitation extends AbstractEntity<Invitation> {

    @Column({ nullable: false, name: 'code'})
    public code: string;

    @Column({ nullable: false, name: 'user_id'})
    public userId: string;

    @ManyToOne(() => User, user => user.invitations)
    @JoinColumn({ name: 'user_id'})
    public user: User

    @Column({ nullable: false, name: 'roomId'})
    public roomId: string;

    @ManyToOne(() => Room)
    @JoinColumn({ name: 'room_id'})
    public room: Room

    @Column({
        type: 'timestamp without time zone',
        name: 'expires_at',
        nullable: true,
    })
    public expiresAt: Date;

}