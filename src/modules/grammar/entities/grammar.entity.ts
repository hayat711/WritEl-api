import {AbstractEntity} from "../../../common/entities/abstract.entitiy";
import {Column, Entity} from "typeorm";

@Entity()
export class Grammar extends AbstractEntity<Grammar>{

    @Column()
    content: string;

    @Column({
        nullable: true
    })
    title: string;

}
