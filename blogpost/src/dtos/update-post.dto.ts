import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class UpdatePostDto{
    @ApiProperty({
        description: 'Enter title of post',
        example: 'first post'
    })
    @IsString()
    @IsOptional()
    @Length(2,30)
    title: string;

    @ApiProperty({
        description: 'Enter description of post',
        example: 'first post description'
    })
    @IsString()
    @IsOptional()
    @Length(2, 255)
    description: string;
}