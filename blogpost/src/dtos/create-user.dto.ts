import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Constants } from "../utils/constants";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto{
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

    @ApiProperty({
        description: 'Enter your name',
        example: 'John'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Enter role',
        example: 'user',
        enum: Constants.ROLES
    })
    @IsString()
    @IsOptional()
    @IsEnum(Constants.ROLES)
    role: string;
}