import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Comment } from "../../entities";

@Injectable()
export class CommentRepository extends Repository<Comment>{
    constructor(private data: DataSource) {
        super(Comment, data.createEntityManager());
    }
}