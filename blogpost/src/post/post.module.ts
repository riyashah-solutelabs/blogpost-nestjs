import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { PostRepository } from './repository/post.repo';
import { CommentRepository } from './repository/comment.repo';
import { CommentService } from './services/comment.service';
import { CommentController } from './controllers/comment.controller';
import { ReplyController } from './controllers/reply.controller';
import { ReplyService } from './services/reply.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from 'src/entities/reply.entity';

@Module({
  // imports: [forwardRef(() => UserModule)],
  imports: [TypeOrmModule.forFeature([Reply])],
  providers: [PostService, PostRepository, CommentRepository, CommentService, ReplyService],
  controllers: [PostController, CommentController ,ReplyController],
  exports: [PostRepository, PostService]
})
export class PostModule {}
