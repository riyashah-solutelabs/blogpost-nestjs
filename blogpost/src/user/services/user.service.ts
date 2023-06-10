import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repo';
import { Constants } from '../../utils/constants';
import { Equal, Not } from 'typeorm';
import { UserResponseDto } from '../../response';

@Injectable()
export class UserService {

    constructor(private userRepo: UserRepository,
    ) { }

    getAllUsers(): Promise<UserResponseDto[]> {
        return this.userRepo.find({
            where: {
                role: Not(Equal(Constants.ROLES.SUPERADMIN_ROLE))
              }
        });
        return this.userRepo.find();
    }

    findByEmail(email: string): Promise<UserResponseDto> {
        return this.userRepo.findOne({
            where: { email: email }
        })
    }

    findByToken(token: string): Promise<UserResponseDto> {
        return this.userRepo.findOne({
            where: { resetToken: token }
        })
    }

    findUserById(id: string): Promise<UserResponseDto> {
        return this.userRepo.findOne({
            where: {
                id: id
            }
        })
    }

    searchUserByName(name: string): Promise<UserResponseDto[]> {
        return this.userRepo.findUserByName(name)
    }
}
