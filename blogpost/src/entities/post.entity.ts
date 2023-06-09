import { User } from "./index";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Comment } from "./comments.entity";

@Entity()
export class Post {
    // @PrimaryGeneratedColumn()
    // id: number;

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Comment, comment => comment.post, {
        eager: true
    })
    comments: Comment[];

    @ManyToOne(() => User, user => user.posts)
    author: User;

    @Column({
        type: Number,
        default: 0
    })
    totalLikes: number;

    @Column({
        type: Number,
        default: 0
    })
    totalDisLikes: number;

    @ManyToMany(() => User)
    @JoinTable()
    likedBy: User[];

    @ManyToMany(() => User)
    @JoinTable()
    dislikedBy: User[];

}