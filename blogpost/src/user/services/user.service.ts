import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repo';
import { Constants } from '../../utils/constants';
import { PostRepository } from '../../post/repository/post.repo';

@Injectable()
export class UserService {

    constructor(private userRepo: UserRepository, 
        private postRepo: PostRepository    
    ) { }
    findByEmail(email: string) {
        return this.userRepo.findOne({
            where: { email: email }
        })
    }

    findUserById(id: number){
        return this.userRepo.findOne({
            where: {
                id: id
            }
        })
    }

    async getUsers() {
        return this.userRepo.find({
            where: {
                role: Constants.ROLES.NORMAL_ROLE
            }
        })
        // const user = await this.userRepo
        //     .createQueryBuilder('user')
        //     .leftJoinAndSelect('user.posts', 'posts')
        //     .select(['user', 'posts.id'])
        //     .where('')
        //     .getMany();

        // return user;
    }

    async getAllPosts() {
        const posts = await this.postRepo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.likedBy', 'likedBy')
        .leftJoinAndSelect('post.dislikedBy', 'dislikedBy')
        .leftJoinAndSelect('post.author', 'author')
        .leftJoinAndSelect('post.comments', 'comments')
        .select(['post', 'likedBy.id', 'author.id', 'dislikedBy.id', 'comments'])
        .orderBy('post.createdAt', 'DESC') 
        .addOrderBy('post.totalLikes', 'DESC')
        .addOrderBy('comments', 'DESC')
        .addOrderBy('post.totalDisLikes', 'DESC')
        .where('post.totalDisLikes < :dislikes', { dislikes: 15 })
        .getMany();

    return posts;
    }
}
