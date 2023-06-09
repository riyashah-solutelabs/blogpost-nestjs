import { ApiProperty } from "@nestjs/swagger";
import { User, Post } from "src/entities";
import { Reply } from "src/entities/reply.entity";

export class CommentResponseDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  user: User;

  @ApiProperty()
  post: Post;

  @ApiProperty({ type: [Reply] })
  replies: Reply[];

  @ApiProperty({ type: [User] })
  likedBy: User[];

  @ApiProperty()
  totalLikes: number;

  @ApiProperty()
  totalDisLikes: number;

  @ApiProperty({ type: [User] })
  dislikedBy: User[];
}
