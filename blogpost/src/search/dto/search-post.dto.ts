// import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";

export class SearchPostDto{
    // @ApiProperty({
    //     description: 'What do you want to search?',
    //     example: 'wo'
    // })
    @IsNotEmpty()
    // @Length(2, 255)
    title: string;
}