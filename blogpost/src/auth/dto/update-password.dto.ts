import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdatePasswordDto{
    @ApiProperty({
        description: 'Your Email Id',
        example: 'your-email@gmail.com'
    })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Enter your old password',
        example: 'password123'
    })
    @IsString()
    @IsNotEmpty()
    oldpassword: string;

    @ApiProperty({
        description: 'Enter New password',
        example: 'password'
    })
    @IsString()
    @IsNotEmpty()
    newpassword: string;

}