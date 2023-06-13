import {AbstractEntity} from "../../../common/entities/abstract.entitiy";
import {Column, Entity, ManyToOne} from "typeorm";
import {User} from "../../user/entities/user.entity";

@Entity()
export class Writing extends AbstractEntity<Writing> {

    @Column()
    title: string;

    @Column({ nullable: true})
    content: string;

    @ManyToOne(() => User, user => user.writings, {
        onDelete: 'CASCADE', nullable: true
    })
    author: User



}
