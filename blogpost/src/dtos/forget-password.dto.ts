import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ForgotPasswordDto{
    @ApiProperty({
        description: 'Enter your email id'
    })
    @IsString()
    @IsEmail()
    email: string;
}