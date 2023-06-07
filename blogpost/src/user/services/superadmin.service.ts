import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repo';
import { Constants } from '../../utils/constants';
import { PostRepository } from '../../post/repository/post.repo';
import { AdminService } from './admin.service';

@Injectable()
export class SuperAdminService {

    constructor(private userRepo: UserRepository,
        private adminService: AdminService,
        private postRepo: PostRepository
    ) { }

    async GetAdmin() {
        const admin = await this.userRepo.find({
            where: {
                role: Constants.ROLES.ADMIN_ROLE
            }
        })
        return admin;
    }

    async DeleteAllPost(postId: number) {
        const post = await this.adminService.getPostById(postId);
        if (!post) {
            throw new NotFoundException('post not found');
        }
        return this.postRepo.softDelete(postId);
    }

    async DeleteAdmin(userId: number) {
        const getUser = await this.userRepo.findOne({
            where: {
                id: userId
            }
        });
        if (!getUser) {
            throw new NotFoundException('admin not found');
        }
        if (getUser.role === Constants.ROLES.ADMIN_ROLE) {
            return await this.userRepo.softDelete(userId);
        } else {
            throw new NotFoundException('admin not found');
        }
    }

    async changeAdminStatus(userId: number) {
        const getUser = await this.userRepo.findOne({
            where: {
                id: userId
            }
        });
        if (!getUser) {
            throw new NotFoundException('user not found');
        }
        if (getUser.role === Constants.ROLES.SUPERADMIN_ROLE) {
            throw new ForbiddenException('You can Not update status of this user');
        }
        if (getUser.role === Constants.ROLES.ADMIN_ROLE) {
            if (getUser.status === 'active') {
                getUser.status = 'inactive'
            } else {
                getUser.status = 'active';
            }
        }else{
            throw new NotFoundException('admin not found');
        }

        await this.userRepo.save(getUser);
        return {
            message: `status is updates to ${getUser.status}`
        }
    }

    searchAdminByName(name: string) {
        return this.userRepo.findAdminByName(name)
    }
}
