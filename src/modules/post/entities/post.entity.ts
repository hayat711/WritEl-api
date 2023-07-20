import {AbstractEntity} from "../../../common/entities/abstract.entitiy";
import {Column, Entity, ManyToOne} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Forum} from "../../forum/entities/froum.entity";
import {ForumCategory} from "../../../common/enums/forum.category.enum";

@Entity()
export class Post extends AbstractEntity<Post>{

    @Column()
    title: string;

    @Column({
        nullable: true
    })
    description:string;

    @Column()
    content: string;

    @Column({
        nullable: false,
        type: 'enum',
        enum: ForumCategory,
        default: ForumCategory.General,
    })
    category: ForumCategory;


    @Column({ default: 0})
    likes: number;

    @Column({ default: 0})
    dislikes: number;

    @Column({ default: 0})
    views: number;

    @Column('text',{
        name: 'liked_users',
        array: true,
        nullable: true
    })
    likedUsers: string[];

    @Column('text',{
        name: 'disliked_users',
        array: true,
        nullable: true
    })
    dislikedUsers: string[];

    @Column({
        type: 'jsonb',
        nullable: true
    })
    draft: string;


    @ManyToOne(() => User, user => user.posts, {
        nullable: true, onDelete:'CASCADE'
    })
    author: User;

    @ManyToOne(() => Forum, forum => forum.posts, {
        onDelete: 'CASCADE', nullable: true
    })
    forum: Forum;


}
