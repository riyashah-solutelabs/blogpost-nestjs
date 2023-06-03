import { Injectable } from "@nestjs/common";
import MeiliSearch, { Index, SearchParams } from "meilisearch";
import { Constants } from "src/utils/constants";

@Injectable()
export class SearchService {
    private _client: MeiliSearch;


    constructor() {
        this._client = new MeiliSearch({
            host: 'http://192.168.99.100:7800',
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
    public async addDocuments(documents) {
        const index = this.getUserIndex();
        return await index.addDocuments(documents);
    }
    public async DeleteUserDocuments() {
        const index = this.getUserIndex();
        return await index.deleteAllDocuments();
    }
    public async DeletePostDocuments() {
        const index = this.getPostIndex();
        return await index.deleteAllDocuments();
    }

    public async search(user: any, text: string, searchParams?: SearchParams) {
        const index = this.getPostIndex();
        const search = await index.search(text, searchParams);
        if (user.role === Constants.ROLES.NORMAL_ROLE) {
            return search.hits.filter(post => post.totalDisLikes < 1)
        } else {
            return search;
        }
    }
    public async searchUser(name: string, searchParams?: SearchParams) {
        const index = this.getUserIndex();
        return await index.search(name, searchParams)
    }
}