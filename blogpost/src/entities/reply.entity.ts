import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

  @ManyToOne(() => Reply, reply => reply.parentReplies, {
    onDelete: 'CASCADE',
  })
  childReply: Reply;

  @OneToMany(() => Reply, reply => reply.parentReply)
  parentReplies: Reply[];

}
