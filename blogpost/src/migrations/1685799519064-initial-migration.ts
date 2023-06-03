import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1685799519064 implements MigrationInterface {
    name = 'InitialMigration1685799519064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "totalLikes" integer NOT NULL DEFAULT '0', "totalDisLikes" integer NOT NULL DEFAULT '0', "deletedAt" TIMESTAMP, "authorId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'superadmin', 'user')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "subscribed" boolean NOT NULL DEFAULT false, "status" character varying NOT NULL DEFAULT 'active', "deletedAt" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "createdBy" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "totalLikes" integer NOT NULL DEFAULT '0', "totalDisLikes" integer NOT NULL DEFAULT '0', "userId" integer, "postId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_liked_by_user" ("postId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_026bf754be74bd293c9e7774f05" PRIMARY KEY ("postId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fe77d226ba9995f4465341080c" ON "post_liked_by_user" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_881d775c205c0ffdf10031e5ca" ON "post_liked_by_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "post_disliked_by_user" ("postId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_9c481ade0d3f6b988d8e9788bbb" PRIMARY KEY ("postId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_84a6e8e5d1f020aa578ddb090e" ON "post_disliked_by_user" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c09f4b140fb935fd8ab1cae087" ON "post_disliked_by_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "comment_liked_by_user" ("commentId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_117637ba11e1aee59c77337feb2" PRIMARY KEY ("commentId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8c43719f5483d3f2dd1e4d1ef0" ON "comment_liked_by_user" ("commentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dae8402ae22f4bfa0dcabda3c6" ON "comment_liked_by_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "comment_disliked_by_user" ("commentId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_05001b8b8a9a6d6a7ba5968a44c" PRIMARY KEY ("commentId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f5ae21db6cbd444790023e21f8" ON "comment_disliked_by_user" ("commentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_71c22350468d699454d3b3227e" ON "comment_disliked_by_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_liked_by_user" ADD CONSTRAINT "FK_fe77d226ba9995f4465341080c3" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_liked_by_user" ADD CONSTRAINT "FK_881d775c205c0ffdf10031e5cab" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_disliked_by_user" ADD CONSTRAINT "FK_84a6e8e5d1f020aa578ddb090ea" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_disliked_by_user" ADD CONSTRAINT "FK_c09f4b140fb935fd8ab1cae087c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "comment_liked_by_user" ADD CONSTRAINT "FK_8c43719f5483d3f2dd1e4d1ef00" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "comment_liked_by_user" ADD CONSTRAINT "FK_dae8402ae22f4bfa0dcabda3c6c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "comment_disliked_by_user" ADD CONSTRAINT "FK_f5ae21db6cbd444790023e21f8a" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "comment_disliked_by_user" ADD CONSTRAINT "FK_71c22350468d699454d3b3227eb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_disliked_by_user" DROP CONSTRAINT "FK_71c22350468d699454d3b3227eb"`);
        await queryRunner.query(`ALTER TABLE "comment_disliked_by_user" DROP CONSTRAINT "FK_f5ae21db6cbd444790023e21f8a"`);
        await queryRunner.query(`ALTER TABLE "comment_liked_by_user" DROP CONSTRAINT "FK_dae8402ae22f4bfa0dcabda3c6c"`);
        await queryRunner.query(`ALTER TABLE "comment_liked_by_user" DROP CONSTRAINT "FK_8c43719f5483d3f2dd1e4d1ef00"`);
        await queryRunner.query(`ALTER TABLE "post_disliked_by_user" DROP CONSTRAINT "FK_c09f4b140fb935fd8ab1cae087c"`);
        await queryRunner.query(`ALTER TABLE "post_disliked_by_user" DROP CONSTRAINT "FK_84a6e8e5d1f020aa578ddb090ea"`);
        await queryRunner.query(`ALTER TABLE "post_liked_by_user" DROP CONSTRAINT "FK_881d775c205c0ffdf10031e5cab"`);
        await queryRunner.query(`ALTER TABLE "post_liked_by_user" DROP CONSTRAINT "FK_fe77d226ba9995f4465341080c3"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_71c22350468d699454d3b3227e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f5ae21db6cbd444790023e21f8"`);
        await queryRunner.query(`DROP TABLE "comment_disliked_by_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dae8402ae22f4bfa0dcabda3c6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8c43719f5483d3f2dd1e4d1ef0"`);
        await queryRunner.query(`DROP TABLE "comment_liked_by_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c09f4b140fb935fd8ab1cae087"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_84a6e8e5d1f020aa578ddb090e"`);
        await queryRunner.query(`DROP TABLE "post_disliked_by_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_881d775c205c0ffdf10031e5ca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe77d226ba9995f4465341080c"`);
        await queryRunner.query(`DROP TABLE "post_liked_by_user"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "post"`);
    }

}
