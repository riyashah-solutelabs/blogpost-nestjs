import { Injectable } from "@nestjs/common";
import MeiliSearch, { Index, SearchParams } from "meilisearch";
import { Constants } from "../../utils/constants";

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
            return search.hits.filter(post => post.totalDisLikes < 15)
        } else {
            return search;
        }
    }
    public async searchUser(user: any, name: string, searchParams?: SearchParams) {
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