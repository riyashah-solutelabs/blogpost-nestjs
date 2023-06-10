import { User } from "./";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post.entity";
import { Reply } from "./reply.entity";
import { v4 as uuid } from 'uuid';

@Entity()
export class Comment {
  // @PrimaryGeneratedColumn()
  // id: number;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.comments)
  user: User;

  @ManyToOne(() => Post, post => post.comments, {
    onDelete: 'CASCADE'
  })
  post: Post;

  @OneToMany(() => Reply, reply => reply.comment, {
    eager: true
  })
  replies: Reply[];

  @ManyToMany(() => User)
  @JoinTable()
  likedBy: User[];

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
  dislikedBy: User[];
}