import { DataSource, Repository } from "typeorm";
import { Post } from "../../entities";
import { Injectable } from "@nestjs/common";
import { PostResponseDto } from "src/response";

@Injectable()
export class PostRepository extends Repository<Post>{
    constructor(private data: DataSource) {
        super(Post, data.createEntityManager());
    }
    async findByTitle(title: string): Promise<Post[]> {
        return this.createQueryBuilder('post')
            .where('post.title ILIKE :title', { title: `%${title}%` })
            .andWhere('post.totalDisLikes < :totalDislikes', { totalDislikes: 15 })
            .getMany();
    }

    async getPosts(): Promise<PostResponseDto[]> {
        const posts = await this
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.likedBy', 'likedBy')
            .leftJoinAndSelect('post.dislikedBy', 'dislikedBy')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('comments.replies', 'replies')
            .leftJoinAndSelect('replies.parentReply', 'parentReply')
            .leftJoinAndSelect('replies.childReplies', 'nestedReplies')
            .select([
                'post',
                'likedBy.id',
                'author.id',
                'dislikedBy.id',
                'comments',
                'replies',
                'parentReply',
                'nestedReplies'
            ])
            .orderBy('post.createdAt', 'DESC')
            .addOrderBy('post.totalLikes', 'DESC')
            .addOrderBy('comments', 'DESC')
            .addOrderBy('post.totalDisLikes', 'DESC')
            .where('post.totalDisLikes < :dislikes', { dislikes: 15 })
            .getMany();

        return posts;
    }

    async getPostById(postId: string): Promise<PostResponseDto> {

        const post = await this
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.likedBy', 'likedBy')
            .leftJoinAndSelect('post.dislikedBy', 'dislikedBy')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.comments', 'comments')
            .select(['post', 'likedBy', 'author.id', 'dislikedBy', 'comments'])
            .where('post.id = :id', { id: postId })
            .getOne();

        return post;
    }
}