// import { User } from "../../user/entities/user.entity";
// import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { Post } from "./post.entity";
// import { Comment } from "./comments.entity";

// @Entity({ name: 'dislikes'})
// export class DisLikes{
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column({
//         default: 0
//     })
//     totalDisLikes: number;

//     @ManyToOne(() => User, (user) => user.postDisLikes)
//     user: User

//     @ManyToOne(() => Post, (post) => post.dislikes)
//     post: Post;

//     // @ManyToOne(() => Comment, (comment) => comment.dislikes)
//     // DisLikecomments: Comment;

//     // @ManyToOne(() => User, (user) => user.commentDisLikes)
//     // commentdislikedby: User
// }