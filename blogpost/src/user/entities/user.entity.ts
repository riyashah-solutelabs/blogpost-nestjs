import { Constants } from "../../utils/constants"
import { BeforeInsert, BeforeUpdate, Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../../post/entities/post.entity";
import { Comment } from "../../post/entities/comments.entity";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

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

    @OneToMany(() => Post, post => post.likedBy)
    likedPosts: Post[];

    @OneToMany(() => Post, post => post.dislikedBy)
    dislikedPosts: Post[];

    @OneToMany(() => Comment, comment => comment.likedBy)
    likedComments: Comment[];

    @OneToMany(() => Comment, comment => comment.dislikedBy)
    dislikedComments: Comment[];


    @BeforeInsert()
    updateSubsription() {
        if (this.role === Constants.ROLES.ADMIN_ROLE || this.role === Constants.ROLES.SUPERADMIN_ROLE) {
            this.subscribed = true; // Set default value based on condition
        }
    }
}