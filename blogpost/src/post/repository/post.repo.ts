import { DataSource, Repository } from "typeorm";
import { Post } from "../../entities";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PostRepository extends Repository<Post>{
    constructor(private data: DataSource) {
        super(Post, data.createEntityManager());
    }
}