import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
// import { ApiTags } from "@nestjs/swagger";
import { SearchService } from "../services/search.service";
import { UserService } from "../../user/services/user.service";
import { PostService } from "../../post/services/post.service";
import { SearchPostDto, SearchUserDto } from "../dto";
import { GetUser } from "../../auth/decorator";
import { JwtGuard, SubscriptionGuard, UserStatusGuard } from "../../auth/guards";

// @ApiTags('Search')
@UseGuards(JwtGuard, UserStatusGuard, SubscriptionGuard)
@Controller('/search')
export class SearchController {
    constructor(private searchService: SearchService,
        private usersService: UserService,
        private postService: PostService,
    ) { }

    @Get('/post')
    public async PostgetSearch(): Promise<void> {
        const resp1 = await this.searchService.addDocumentsPost([...await this.postService.getAllPost()]);
    }

    @Get('users')
    public async getSearch(): Promise<void> {
        const resp = await this.searchService.addDocuments([...await this.usersService.getAllUsers()]);
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