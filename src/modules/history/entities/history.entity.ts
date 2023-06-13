import {AbstractEntity} from "../../../common/entities/abstract.entitiy";
import {Column, Entity, ManyToOne} from "typeorm";
import {User} from "../../user/entities/user.entity";

@Entity()
export class History extends AbstractEntity<History>{

    @Column({nullable: true})
    title: string;

    @Column()
    content: string;

    @ManyToOne(() => User, user => user.histories, {
        onDelete: 'CASCADE', nullable: true
    })
    owner: User
}
