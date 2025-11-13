import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1763002839682 implements MigrationInterface {
    name = 'InitTables1763002839682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid, "updated_by" uuid, "deleted_by" uuid, "name" character varying NOT NULL, "email" character varying NOT NULL, "api_key" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b48860677afe62cd96e1265948" ON "clients" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_740fe6d4fd0cd0ff47d766c8e0" ON "clients" ("api_key") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_740fe6d4fd0cd0ff47d766c8e0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b48860677afe62cd96e1265948"`);
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
