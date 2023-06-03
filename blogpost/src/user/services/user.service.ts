import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repo';
import { Constants } from '../../utils/constants';
import { PostRepository } from '../../post/repository/post.repo';

@Injectable()
export class UserService {

    constructor(private userRepo: UserRepository,
    ) { }

    getAllUsers() {
        return this.userRepo.find();
    }

    findByEmail(email: string) {
        return this.userRepo.findOne({
            where: { email: email }
        })
    }

    findUserById(id: number) {
        return this.userRepo.findOne({
            where: {
                id: id
            }
        })
    }
}
