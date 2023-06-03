import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service'
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';

@Module({
    imports: [UserModule, PostModule],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule {}
