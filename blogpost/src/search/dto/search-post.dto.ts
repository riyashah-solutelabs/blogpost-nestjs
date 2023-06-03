// import { ApiProperty } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";

export class SearchPostDto{
    @ApiProperty({
        description: 'What do you want to search?',
        example: 'fi'
    })
    @IsNotEmpty()
    @Length(2, 255)
    title: string;
}