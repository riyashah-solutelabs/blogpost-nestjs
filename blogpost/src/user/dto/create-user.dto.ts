import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Constants } from "../../utils/constants";

export class CreateUserDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    @IsEnum(Constants.ROLES)
    role: string;
}