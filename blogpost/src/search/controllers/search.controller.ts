import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { SearchService } from "../services/search.service";
import { UserService } from "../../user/services/user.service";
import { PostService } from "../../post/services/post.service";
import { SearchPostDto, SearchUserDto } from "../dto";
import { GetUser } from "../../auth/decorator";
import { JwtGuard, RolesGuard, SubscriptionGuard, UserStatusGuard } from "../../auth/guards";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";

@ApiTags('Search')
@ApiSecurity('JWT-Auth')
@UseGuards(RolesGuard, UserStatusGuard, SubscriptionGuard)
@Controller('/search')
export class SearchController {
    constructor(private searchService: SearchService,
        private usersService: UserService,
        private postService: PostService,
    ) { }
    
    @Get('/post')
    public async PostgetSearch(): Promise<void> {
        const response = await this.searchService.DeletePostDocuments();
        const resp1 = await this.searchService.addDocumentsPost([...await this.postService.getAllPost()]);
    }

    @Get('users')
    public async getSearch(): Promise<void> {
        const user = await this.usersService.getAllUsers();
        const documents = user.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            subscribed: user.subscribed
        }));
        const response = await this.searchService.DeleteUserDocuments();
        const resp = await this.searchService.addDocuments(documents);

        
    }

    @Post('/post')
    public async searchAllPost(@GetUser() user, @Body() search: SearchPostDto) {
        return await this.searchService.search(user, search.title, {
            attributesToHighlight: ['*']
        })
    }

    @Post('/user')
    public async searchUser(@Body() search: SearchUserDto) {
        return await this.searchService.searchUser(search.name, {
            attributesToHighlight: ['*']
        })
    }
}