// import { User } from "src/user/entities/user.entity";
// import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { Post } from "./post.entity";
// import { Comment } from "./comments.entity";

// @Entity()
// export class Likes{
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column({
//         default: 0,
//         type: Number
//     })
//     totalLikes: number;

//     @OneToMany(() => User, (user) => user.postLikes)
//     likedBy: User[]

//     @ManyToOne(() => Post, (post) => post.likes)
//     post: Post;

//     // @ManyToOne(() => Comment, (comment) => comment.likes)
//     // Likecomments: Comment;

//     // @ManyToOne(() => User, (user) => user.commentLikes)
//     // commentlikedby: User
// }