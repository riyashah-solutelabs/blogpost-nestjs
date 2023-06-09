import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto{
    @ApiProperty({
        description: 'Enter your token',
    })
    @IsNotEmpty()
    token: string;

    @ApiProperty({
        description: 'Enter your password',
        example: 'password123'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}