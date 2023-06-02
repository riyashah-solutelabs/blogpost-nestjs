import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Comment } from "./comments.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Comment, comment => comment.post)
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

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;

    @ManyToMany(() => User)
    @JoinTable()
    likedBy: User[];

    @ManyToMany(() => User)
    @JoinTable()
    dislikedBy: User[];

}