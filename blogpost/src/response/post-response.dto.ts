import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { User, Comment } from "src/entities";

export class PostResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [Comment] })
  comments: Comment[];

  @ApiProperty()
  author: User;

  @ApiProperty()
  totalLikes: number;

  @ApiProperty()
  totalDisLikes: number;

  @ApiProperty({ type: [User] })
  likedBy: User[];

  @ApiProperty({ type: [User] })
  dislikedBy: User[];
}
