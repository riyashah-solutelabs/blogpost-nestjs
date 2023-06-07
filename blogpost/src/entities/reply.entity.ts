import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comments.entity";
import { User } from "./user.entity";

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.reply)
  user: User;

  @ManyToOne(() => Comment, comment => comment.replies, {
    onDelete: 'CASCADE'
  })
  comment: Comment;

  @ManyToOne(() => Reply, reply => reply.childReplies, {
    onDelete: 'CASCADE',
  })
  parentReply: Reply;

  @OneToMany(() => Reply, reply => reply.parentReply)
  childReplies: Reply[];

  @ManyToMany(() => User)
  @JoinTable()
  likedBy: User[];

  @ManyToMany(() => User)
  @JoinTable()
  dislikedBy: User[];

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

}
