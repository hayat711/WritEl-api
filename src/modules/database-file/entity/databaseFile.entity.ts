import {AbstractEntity} from "../../../common/entities/abstract.entitiy";
import {Column, Entity} from "typeorm";


@Entity()
class DatabaseFile extends AbstractEntity<DatabaseFile>{
    @Column()
    filename: string;

    @Column({
        type: 'bytea',
    })
    data: Uint8Array;

    get Base64Data(): string {
        return this.data.toString();
    }
}

export default DatabaseFile;