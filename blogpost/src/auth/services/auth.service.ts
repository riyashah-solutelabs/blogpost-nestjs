import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UserRepository } from '../../user/repository/user.repo';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
// import * as bcrypt from 'bcrypt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        private userRepo: UserRepository, 
        private userService: UserService,
        private jwtService: JwtService
    ) { }
    async signup(userData: CreateUserDto): Promise<User> {
        const users = await this.userService.findByEmail(userData.email);
        if (users) {
            throw new BadRequestException('email in use');
        }
        // Hash the users password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');
        
        // Hash the salt and the password together
        const hash = (await scrypt(userData.password, salt, 32)) as Buffer;
        
        
        const user = await this.userRepo.create(userData);

        // Join the hashed result and the salt together
        user.password = salt + '.' + hash.toString('hex');
        // Create a new user and save it
        return await this.userRepo.save(user);
    }

    async signin(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('user with this email does not exist');
        }
        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;
    
        if (storedHash !== hash.toString('hex')) {
          throw new BadRequestException('bad password');
        }
    
        const token = await this.generateToken(user);
        return token;
    }

    generateToken(user) {
      console.log(user)
        return {
          access_token: this.jwtService.sign({
            email: user.email,
            role: user.role,
            sub: user.id,
            isSubscribed: user.subscribed,
            name: user.name
          })
        }
      }

      async getSubscription(userId) {
        const user = await this.userService.findUserById(userId);
        // if(user.subscribed === true){
        //     throw new ConflictException('You already have a subscription.')
        // }
        user.subscribed = true;
        await this.userRepo.save(user);
        const token = this.generateToken(user);
        return {
          token,
          message: 'Subscribed Successfully'
        };
    }
}


