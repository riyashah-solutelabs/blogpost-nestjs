import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repo';
import { PostModule } from '../post/post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), forwardRef(() => PostModule)
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository]
})
export class UserModule {}
