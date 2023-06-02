import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Comment } from "../entities/comments.entity";

@Injectable()
export class CommentRepository extends Repository<Comment>{
    constructor(private data: DataSource) {
        super(Comment, data.createEntityManager());
    }
}