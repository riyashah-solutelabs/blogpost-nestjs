import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { PostRepository } from './repository/post.repo';
import { CommentRepository } from './repository/comment.repo';
import { CommentService } from './services/comment.service';
import { CommentController } from './controllers/comment.controller';

@Module({
  // imports: [forwardRef(() => UserModule)],
  imports: [],
  providers: [PostService, PostRepository, CommentRepository, CommentService],
  controllers: [PostController, CommentController],
  exports: [PostRepository, PostService]
})
export class PostModule {}
