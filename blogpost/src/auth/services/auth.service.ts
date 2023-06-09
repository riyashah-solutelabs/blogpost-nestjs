import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, ForgotPasswordDto, ResetPasswordDto } from '../../dtos';
import { UserRepository } from '../../user/repository/user.repo';
import { UserService } from '../../user/services/user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { UpdatePasswordDto } from '../../dtos';
import { EmailService } from './email.service';
import { v4 as uuidv4 } from 'uuid';
import { MessageResponseDto, TokenResponseDto, UserResponseDto } from 'src/response';
import { ErrorMessage } from 'src/utils/errorMessage';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService
  ) { }
  async signup(userData: CreateUserDto): Promise<UserResponseDto> {
    const users = await this.userService.findByEmail(userData.email);
    if (users) {
      throw new ConflictException(ErrorMessage.EMAIL_EXISTS);
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

  async signin(email: string, password: string): Promise<TokenResponseDto> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
    if (user.status === 'inactive') {
      throw new NotFoundException(ErrorMessage.USER_INACTIVE);
    }
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException(ErrorMessage.INCORRECT_PASSWORD);
    }

    const token = await this.generateToken(user);
    return token;
  }

  async updatePassword(user: any, updatePassword: UpdatePasswordDto): Promise<MessageResponseDto> {
    const userData = await this.userService.findByEmail(updatePassword.email);
    if (!userData) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
    if (user.email !== updatePassword.email) {
      throw new ForbiddenException(ErrorMessage.NOT_ALLOWED);
    }

    const [salt, storedHash] = userData.password.split('.');
    let hash = (await scrypt(updatePassword.oldpassword, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException(ErrorMessage.INCORRECT_PASSWORD);
    }

    hash = (await scrypt(updatePassword.newpassword, salt, 32)) as Buffer;

    updatePassword.newpassword = salt + '.' + hash.toString('hex');

    await this.userRepo.update(user.userId, {
      password: updatePassword.newpassword
    });

    return {
      message: 'password updated successfully'
    }

  }

  generateToken(user): TokenResponseDto {
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

  async getSubscription(userId): Promise<MessageResponseDto> {
    const user = await this.userService.findUserById(userId);
    if (user.subscribed === true) {
      throw new ConflictException(ErrorMessage.SUBSCRIPTION_CONFLICT)
    }
    user.subscribed = true;
    await this.userRepo.save(user);
    return {
      message: 'Subscribed Successfully'
    };
  }

  async forgetPassword(user, forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const userData = await this.userService.findByEmail(email);
    if (!userData) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
    console.log("userrrrrrr")
    if (userData.id != user.userId) {
      throw new ForbiddenException(ErrorMessage.NOT_ALLOWED)
    }

    const resetToken = await this.generateResetToken(userData.id);
    const subject = 'Reset Password';
    const resetLink = `<p> click here to reset pw :</p> https://example.com/reset-password?token=${resetToken}`;

    await this.emailService.sendResetPasswordEmail(user.email, subject, resetLink);

    return { message: 'Password reset link has been sent to your email' };
  }

  async generateResetToken(userId: number): Promise<string> {
    // Generate a unique reset token using UUID or any other library
    const resetToken = uuidv4();
    // Store the reset token in the database along with user ID and expiration timestamp
    const user = await this.userService.findUserById(userId)
    user.resetToken = resetToken;
    user.resetTokenExpiration = new Date(Date.now() + 3600000)
    await this.userRepo.save(user);

    return resetToken;
  }

  async resetPassword(user, resetPasswordDto: ResetPasswordDto): Promise<MessageResponseDto> {
    let { token, password } = resetPasswordDto;
    // Verify the reset token and allow password reset
    const userData = await this.userService.findByToken(token);

    if (!userData || userData.id != user.userId) {
      // Token is not associated with any user, return false
      throw new ForbiddenException(ErrorMessage.NOT_ALLOWED)
    }
    // Check if the reset token has expired
    const currentTime = new Date();
    console.log(userData.resetTokenExpiration)
    if (userData.resetTokenExpiration && userData.resetTokenExpiration.getTime() < currentTime.getTime()) {
      // Token has expired, return false
      throw new ForbiddenException(ErrorMessage.NOT_ALLOWED)
    }

    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;


    // Join the hashed result and the salt together
    const newpassword = salt + '.' + hash.toString('hex');

    await this.userRepo.update(user.userId, {
      password: newpassword
    });

    return {
      message: 'password updated successfully'
    }

  }
}


