import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto{
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsOptional()
    createdBy: string;
}