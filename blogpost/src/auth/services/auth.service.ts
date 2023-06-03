import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UserRepository } from '../../user/repository/user.repo';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
// import * as bcrypt from 'bcrypt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { EmailService } from './email.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService
  ) { }
  async signup(userData: CreateUserDto): Promise<User> {
    const users = await this.userService.findByEmail(userData.email);
    if (users) {
      throw new ConflictException('email in use');
    }
    // Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(userData.password, salt, 32)) as Buffer;


    const user = await this.userRepo.create(userData);

    // Join the hashed result and the salt together
    user.password = salt + '.' + hash.toString('hex');

    const subject = 'Welcome to Our Website';
    const html = '<p>Thank you for signing up!.</p>';
    await this.emailService.sendWelcomeEmail(userData.email, subject, html);

    // Create a new user and save it
    return await this.userRepo.save(user);
  }

  async signin(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('user with this email does not exist');
    }
    if (user.status === 'inactive') {
      throw new NotFoundException('user is inactive');
    }
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    const token = await this.generateToken(user);
    return token;
  }

  async updatePassword(user: any, updatePassword: UpdatePasswordDto) {
    const userData = await this.userService.findByEmail(updatePassword.email);
    if (!userData) {
      throw new NotFoundException('user with this email does not exist');
    }
    if (user.email !== updatePassword.email) {
      throw new ForbiddenException('You are not allowed to update password');
    }

    const [salt, storedHash] = userData.password.split('.');
    let hash = (await scrypt(updatePassword.oldpassword, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('old password is incorrect');
    }

    hash = (await scrypt(updatePassword.newpassword, salt, 32)) as Buffer;

    updatePassword.newpassword = salt + '.' + hash.toString('hex');

    return await this.userRepo.update(user.userId, {
      password: updatePassword.newpassword
    });

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
    if(user.subscribed === true){
        throw new ConflictException('You already have a subscription.')
    }
    user.subscribed = true;
    await this.userRepo.save(user);
    const token = this.generateToken(user);
    return {
      token,
      message: 'Subscribed Successfully'
    };
  }
}


