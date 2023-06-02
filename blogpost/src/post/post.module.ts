import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { PostRepository } from './repository/post.repo';
import { UserModule } from '../user/user.module';
import { CommentRepository } from './repository/comment.repo';
import { CommentService } from './services/comment.service';
import { CommentController } from './controllers/comment.controller';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [PostService, PostRepository, CommentRepository, CommentService],
  controllers: [PostController, CommentController],
  exports: [PostRepository]
})
export class PostModule {}
