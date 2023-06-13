import {AbstractEntity} from "../../../common/entities/abstract.entitiy";
import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {Post} from "../../post/entities/post.entity";
import {User} from "../../user/entities/user.entity";
import {ForumCategory} from "../../../common/enums/forum.category.enum";

@Entity()
export class Forum extends AbstractEntity<Forum>{

    @ManyToOne(() => User, user => user.forums)
    author: User

    @OneToMany(() => Post, post => post.forum, {
        eager: true, nullable: true, cascade: true,
    })
    posts: Post[];

    @Column()
    title: string;

    @Column({ nullable: true})
    description: string;

    @Column({
        nullable: false,
        type: 'enum',
        enum: ForumCategory,
        default: ForumCategory.General,
    })
    category: ForumCategory;


}
