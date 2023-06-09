import { ApiProperty } from "@nestjs/swagger";
import { Comment, Post, Reply } from "src/entities";

export class UserResponseDto {
    @ApiProperty()
    id: number;
    
    @ApiProperty()
    name: string;
    
    @ApiProperty()
    email: string;
    
    @ApiProperty()
    password: string;
    
    @ApiProperty()
    role: string;
    
    @ApiProperty()
    subscribed: boolean;
    
    @ApiProperty()
    status: string;
    
    @ApiProperty()
    deletedAt: Date;
    
    @ApiProperty({ type: [Post] })
    posts: Post[];
    
    @ApiProperty({ type: [Comment] })
    comments: Comment[];
    
    @ApiProperty({ type: [Reply] })
    reply: Reply[];
    
    @ApiProperty({ type: [Post] })
    likedPosts: Post[];
    
    @ApiProperty({ type: [Post] })
    dislikedPosts: Post[];
    
    @ApiProperty({ type: [Comment] })
    likedComments: Comment[];
    
    @ApiProperty({ type: [Comment] })
    dislikedComments: Comment[];

    @ApiProperty()
    resetToken: string;

    @ApiProperty()
    resetTokenExpiration: Date;
}
