import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto{
    @ApiProperty({
        description: 'Enter your email id',
        example: 'john@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Enter your password',
        example: 'password123'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}