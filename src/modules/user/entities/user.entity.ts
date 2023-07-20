import {AbstractEntity} from "../../../common/entities/abstract.entitiy";
import {BeforeInsert, Column, Entity, Index, JoinColumn, OneToMany, OneToOne} from "typeorm";
import {Providers} from "../../../common/enums";
import {Exclude} from "class-transformer";
import {Role} from "../../../common/enums/roles.enum";
import {AccountStatus} from "../../../common/enums/status.enum";
import {Invitation} from "../../room/entities/invitation.entity";
import {Message} from "../../message/entities/message.entity";
import * as argon from 'argon2';
import {Writing} from "../../writing/entities/writing.entity";
import {Post} from "../../post/entities/post.entity";
import {History} from "../../history/entities/history.entity";
import {Forum} from "../../forum/entities/froum.entity";
import {Notification} from "../../notification/entities/notification.entity";
import DatabaseFile from "../../database-file/entity/databaseFile.entity";

@Entity()
export class User extends AbstractEntity<User>{
    @Column({
        name: 'provider',
        nullable: true,
        type: 'enum',
        enum: Providers
    })
    public provider: Providers

    @Index()
    @Column({
        length: 200,
        name: 'provider_id',
        nullable: true
    })
    public providerId : string

    @Index()
    @Column({
        unique: true,
        length: 200,
        name: 'email',
        nullable: false
    })
    public email: string

    @Exclude()
    @Column({
        length: 200,
        name: 'password',
        nullable: false
    })
    password: string;

    @Column({
        name: 'first_name',
        length: 200,
        nullable: false
    })
    public firstName: string

    @Column({
        length: 200,
        name: 'last_name',
        nullable: false
    })
    public lastName: string


    @Column({
        unique: true,
        length: 200,
        name: 'nick_name',
        nullable: false
    })
    public displayName: string

    @Column({
        length: 200,
        name: 'image',
        nullable: true,
        default: null
    })
    public image: string


    @Column({
        type: "enum",
        name: 'role',
        nullable: false,
        default: Role.USER,
        enum: Role
    })
    public role: Role;

    @Column({
        type: 'enum',
        name: 'account_status',
        nullable: false,
        default: AccountStatus.PENDING,
        enum: AccountStatus
    })
    public accountStatus: AccountStatus;

    @JoinColumn({ name: 'avatarId' })
    @OneToOne(() => DatabaseFile, { nullable: true, eager: true})
    public avatar?: DatabaseFile;

    @Column({ nullable: true})
    public avatarId?: string;


    @OneToMany(() => Invitation,
        invitation => invitation.user)
    public invitations: Invitation[]

    @OneToMany(() => Message,
        message => message.author)
    public messages: Message[];


    @OneToMany(() => Writing,
        writing => writing.author)
    writings: Writing[];

    @OneToMany(()=> Post, post => post.author)
    posts: Post[];

    @OneToMany(() => History, history => history.owner, {
        cascade: true, onDelete: "CASCADE"
    })
    histories: History[];

    @OneToMany(() => Forum, forum => forum.owner, {
        onDelete: 'CASCADE', cascade: true
    })
    forums: Forum[];


    @OneToMany(() => Notification, notification => notification.owner, {
        onDelete: 'CASCADE', cascade: true, lazy: true,
    })
    notifications: Notification[];



    @BeforeInsert()
    async hashPassword() {
        this.password = await argon.hash(this.password)
    }

}
