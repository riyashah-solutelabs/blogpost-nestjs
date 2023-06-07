import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "../../entities";
import { Constants } from "src/utils/constants";

@Injectable()
export class UserRepository extends Repository<User>{
    constructor(private data: DataSource) {
        super(User, data.createEntityManager());
    }

    async findUserByName(name: string): Promise<User[]> {
        return this.createQueryBuilder('user')
            .where('user.name ILIKE :name', { name: `%${name}%` })
            .andWhere('user.role = :role', { role: Constants.ROLES.NORMAL_ROLE })
            .getMany();
    }

    async findAdminByName(name: string): Promise<User[]> {
        return this.createQueryBuilder('user')
            .where('user.name ILIKE :name', { name: `%${name}%` })
            .andWhere('user.role = :role', { role: Constants.ROLES.ADMIN_ROLE })
            .getMany();
    }
}