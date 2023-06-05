import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Constants } from '../utils/constants';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class UserDto {
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Enter role',
    example: 'user',
    enum: Constants.ROLES
  })
  @Expose()
  @IsString()
  @IsEnum(Constants.ROLES)
  role: string;
}
