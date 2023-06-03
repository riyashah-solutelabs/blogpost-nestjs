import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreatePostDto{
    @ApiProperty({
        description: 'Enter title of post',
        example: 'first post'
    })
    @IsString()
    @IsNotEmpty()
    @Length(2,30)
    title: string;

    @ApiProperty({
        description: 'Enter description of post',
        example: 'first post description'
    })
    @IsString()
    @IsNotEmpty()
    @Length(2, 255)
    description: string;
}