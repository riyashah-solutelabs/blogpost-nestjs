import { Injectable } from "@nestjs/common";
import MeiliSearch, { Index, SearchParams } from "meilisearch";
import { Constants } from "../../utils/constants";
import { PostResponseDto } from "src/response";

@Injectable()
export class SearchService {
    private _client: MeiliSearch;

    constructor() {
        this._client = new MeiliSearch({
            host: process.env.MEILI_URL,
        })
    }

    // create or get index
    private getPostIndex(): Index {
        return this._client.index('posts');
    }
    private getUserIndex(): Index {
        return this._client.index('users');
    }

    public async addDocumentsPost(documents) {
        const index = this.getPostIndex();
        return await index.addDocuments(documents);
    }
    public async addDocuments(documents): Promise<Record<string, any>> {
        const index = this.getUserIndex();
        return await index.addDocuments(documents);
    }
    public async DeleteUserDocuments(): Promise<Record<string, any>> {
        const index = this.getUserIndex();
        return await index.deleteAllDocuments();
    }
    public async DeletePostDocuments(): Promise<Record<string, any>> {
        const index = this.getPostIndex();
        return await index.deleteAllDocuments();
    }

    public async search(user: any, text: string, searchParams?: SearchParams): Promise<Record<string, any>> {
        const index = this.getPostIndex();
        const search = await index.search(text, searchParams);
        if (user.role === Constants.ROLES.NORMAL_ROLE) {
            return search.hits.filter(post => post.totalDisLikes < 15)
        } else {
            return search;
        }
    }
    public async searchUser(user: any, name: string, searchParams?: SearchParams): Promise<Record<string, any>> {
        const index = this.getUserIndex();
        const search = await index.search(name, searchParams);
        if (user.role === Constants.ROLES.NORMAL_ROLE) {
            return search.hits.filter(user => user.role === Constants.ROLES.NORMAL_ROLE)
        } else if (user.role === Constants.ROLES.ADMIN_ROLE) {
            return search.hits.filter(user => user.role !== Constants.ROLES.SUPERADMIN_ROLE)
        }else{
            return search;
        }
    }
}
