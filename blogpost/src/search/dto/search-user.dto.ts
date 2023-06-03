// import { ApiProperty } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";

export class SearchUserDto{
    @ApiProperty({
        description: 'What do you want to search?',
        example: 'ri'
    })
    @IsNotEmpty()
    @Length(2, 255)
    name: string;
}