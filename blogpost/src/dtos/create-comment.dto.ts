import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommenttDto{
    @ApiProperty({
        description: 'Enter description of comment',
        example: 'This post is very good'
    })
    @IsString()
    @IsNotEmpty()
    description: string;
}