import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repo';
import { Constants } from '../../utils/constants';
import { PostRepository } from '../../post/repository/post.repo';
import { AdminService } from './admin.service';
import { MessageResponseDto, UserResponseDto } from '../../response';
import { ErrorMessage } from 'src/utils/errorMessage';

@Injectable()
export class SuperAdminService {

    constructor(private userRepo: UserRepository,
        private adminService: AdminService,
        private postRepo: PostRepository
    ) { }

    async GetAdmin(): Promise<UserResponseDto[]> {
        const admin = await this.userRepo.find({
            where: {
                role: Constants.ROLES.ADMIN_ROLE
            }
        })
        return admin;
    }

    async DeleteAllPost(postId: number): Promise<MessageResponseDto> {
        const post = await this.adminService.getPostById(postId);
        if (!post) {
            throw new NotFoundException(ErrorMessage.NOT_FOUND);
        }
        await this.postRepo.softDelete(postId);
        return {
            message: 'post is deleted successfully'
        }
    }

    async DeleteAdmin(userId: number): Promise<MessageResponseDto> {
        const getUser = await this.userRepo.findOne({
            where: {
                id: userId
            }
        });
        if (!getUser) {
            throw new NotFoundException(ErrorMessage.NOT_FOUND);
        }
        if (getUser.role === Constants.ROLES.ADMIN_ROLE) {
            await this.userRepo.softDelete(userId);
            return {
                message: 'admin deleted successfully'
            }
        } else {
            throw new NotFoundException(ErrorMessage.NOT_FOUND);
        }
    }

    async changeAdminStatus(userId: number): Promise<MessageResponseDto> {
        const getUser = await this.userRepo.findOne({
            where: {
                id: userId
            }
        });
        if (!getUser) {
            throw new NotFoundException(ErrorMessage.NOT_FOUND);
        }
        if (getUser.role === Constants.ROLES.SUPERADMIN_ROLE) {
            throw new ForbiddenException(ErrorMessage.NOT_ALLOWED);
        }
        if (getUser.role === Constants.ROLES.ADMIN_ROLE) {
            if (getUser.status === 'active') {
                getUser.status = 'inactive'
            } else {
                getUser.status = 'active';
            }
        }else{
            throw new NotFoundException(ErrorMessage.NOT_FOUND);
        }

        await this.userRepo.save(getUser);
        return {
            message: `status is updates to ${getUser.status}`
        }
    }

    searchAdminByName(name: string): Promise<UserResponseDto[]> {
        return this.userRepo.findAdminByName(name)
    }
}
