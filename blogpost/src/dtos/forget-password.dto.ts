import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class ForgotPasswordDto{
    @ApiProperty({
        description: 'Enter your email id',
        example: "jog=hn@gmail.com"
    })
    @IsString()
    @IsEmail()
    email: string;
}