import { User } from "./";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => Post, post => post.comments)
  post: Post;

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