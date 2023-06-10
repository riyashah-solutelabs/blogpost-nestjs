import { Constants } from "../utils/constants"
import { BeforeInsert, Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./";
import { Comment } from "./";
import { Reply } from "./reply.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: Constants.ROLES,
        default: Constants.ROLES.NORMAL_ROLE,
    })
    role: string;

    @Column({
        default: false
    })
    subscribed: boolean;

    @Column({
        default: 'active'
    })
    status: string;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;

    @OneToMany(() => Post, post => post.author)
    posts: Post[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];

    @OneToMany(() => Reply, reply => reply.user)
    reply: Reply[];

    @OneToMany(() => Post, post => post.likedBy)
    likedPosts: Post[];

    @OneToMany(() => Post, post => post.dislikedBy)
    dislikedPosts: Post[];

    @OneToMany(() => Comment, comment => comment.likedBy)
    likedComments: Comment[];

    @OneToMany(() => Comment, comment => comment.dislikedBy)
    dislikedComments: Comment[];

    @Column({ default: null})
    resetToken: string;

    @Column({ type: 'timestamp', nullable: true })
    resetTokenExpiration: Date


    @BeforeInsert()
    updateSubsription() {
        if (this.role === Constants.ROLES.ADMIN_ROLE || this.role === Constants.ROLES.SUPERADMIN_ROLE) {
            this.subscribed = true;
        }
    }
    

}