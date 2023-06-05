import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User } from '../entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repo';
import { PostModule } from '../post/post.module';
import { SuperAdminService } from './services/superadmin.service';
import { SuperAdminController } from './controllers/superadmin.controller';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), PostModule
  ],
  controllers: [UserController, AdminController, SuperAdminController],
  providers: [UserService, UserRepository, AdminService, SuperAdminService],
  exports: [UserService, UserRepository]
})
export class UserModule {}
