import { ApiProperty } from "@nestjs/swagger";
import { Comment, User } from "src/entities";
import { Reply } from "src/entities/reply.entity";

export class ReplyResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [User] })
  user: User;

  @ApiProperty({ type: [Comment] })
  comment: Comment;

  @ApiProperty({ type: [Reply] })
  parentReply: Reply;

  @ApiProperty({ type: [Reply] })
  childReplies: Reply[];

  @ApiProperty({ type: [User] })
  likedBy: User[];

  @ApiProperty({ type: [User] })
  dislikedBy: User[];

  @ApiProperty()
  totalLikes: number;

  @ApiProperty()
  totalDisLikes: number;
}
