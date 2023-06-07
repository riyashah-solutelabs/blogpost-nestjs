import { DataSource, Repository } from "typeorm";
import { Post } from "../../entities";
import { Injectable } from "@nestjs/common";

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
}