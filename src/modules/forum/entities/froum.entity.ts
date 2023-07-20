import { AbstractEntity } from '../../../common/entities/abstract.entitiy';
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
import { ForumCategory } from '../../../common/enums/forum.category.enum';

@Entity()
export class Forum extends AbstractEntity<Forum> {
  @ManyToOne(() => User, (user) => user.forums, {})
  owner: User;

  @Column('text', { name: 'subscribers', nullable: true, array: true })
  subscribers: string[];

  @OneToMany(() => Post, (post) => post.forum, {
    eager: true,
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  posts: Post[];

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ForumCategory,
    default: ForumCategory.General,
  })
  category: ForumCategory;


}
