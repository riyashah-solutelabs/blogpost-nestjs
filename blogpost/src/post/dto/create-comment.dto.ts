import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommenttDto{
    @IsString()
    @IsNotEmpty()
    description: string;
}