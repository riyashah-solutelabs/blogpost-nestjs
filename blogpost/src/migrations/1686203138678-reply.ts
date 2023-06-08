import { MigrationInterface, QueryRunner } from "typeorm";

export class Reply1686203138678 implements MigrationInterface {
    name = 'Reply1686203138678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reply" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "createdBy" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "totalLikes" integer NOT NULL DEFAULT '0', "totalDisLikes" integer NOT NULL DEFAULT '0', "userId" integer, "commentId" integer, "parentReplyId" integer, CONSTRAINT "PK_94fa9017051b40a71e000a2aff9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reply_liked_by_user" ("replyId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_fa52ff554035749a490288b94db" PRIMARY KEY ("replyId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_77be21a1f5704a0a514b7707d2" ON "reply_liked_by_user" ("replyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_518305be2cf8e0b3fcc10cecba" ON "reply_liked_by_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "reply_disliked_by_user" ("replyId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_17e3d163a5d582a5771f71532aa" PRIMARY KEY ("replyId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_10d55336d48f555ddad9063665" ON "reply_disliked_by_user" ("replyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_eeeba7592ac40cf39d5f6c4bcf" ON "reply_disliked_by_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_e9886d6d04a19413a2f0aac5d7b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_b63950f2876403407137a257a9a" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_f0af68fe0e599c7cc7f34699ad5" FOREIGN KEY ("parentReplyId") REFERENCES "reply"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reply_liked_by_user" ADD CONSTRAINT "FK_77be21a1f5704a0a514b7707d21" FOREIGN KEY ("replyId") REFERENCES "reply"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "reply_liked_by_user" ADD CONSTRAINT "FK_518305be2cf8e0b3fcc10cecba9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "reply_disliked_by_user" ADD CONSTRAINT "FK_10d55336d48f555ddad90636658" FOREIGN KEY ("replyId") REFERENCES "reply"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "reply_disliked_by_user" ADD CONSTRAINT "FK_eeeba7592ac40cf39d5f6c4bcfe" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reply_disliked_by_user" DROP CONSTRAINT "FK_eeeba7592ac40cf39d5f6c4bcfe"`);
        await queryRunner.query(`ALTER TABLE "reply_disliked_by_user" DROP CONSTRAINT "FK_10d55336d48f555ddad90636658"`);
        await queryRunner.query(`ALTER TABLE "reply_liked_by_user" DROP CONSTRAINT "FK_518305be2cf8e0b3fcc10cecba9"`);
        await queryRunner.query(`ALTER TABLE "reply_liked_by_user" DROP CONSTRAINT "FK_77be21a1f5704a0a514b7707d21"`);
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_f0af68fe0e599c7cc7f34699ad5"`);
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_b63950f2876403407137a257a9a"`);
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_e9886d6d04a19413a2f0aac5d7b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eeeba7592ac40cf39d5f6c4bcf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_10d55336d48f555ddad9063665"`);
        await queryRunner.query(`DROP TABLE "reply_disliked_by_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_518305be2cf8e0b3fcc10cecba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_77be21a1f5704a0a514b7707d2"`);
        await queryRunner.query(`DROP TABLE "reply_liked_by_user"`);
        await queryRunner.query(`DROP TABLE "reply"`);
    }

}
