import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLogsTable1763039854358 implements MigrationInterface {
  name = 'CreateLogsTable1763039854358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid, "updated_by" uuid, "deleted_by" uuid, "client_id" uuid NOT NULL, "api_key" character varying NOT NULL, "ip_address" character varying NOT NULL, "endpoint" character varying NOT NULL, "method" character varying NOT NULL, "timestamp" bigint NOT NULL, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1aa17ee81ccc60e7bff31f1732" ON "logs" ("client_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_106185d572e56677adcfb55d36" ON "logs" ("api_key") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_576230dd0af7eb2dcf9a88f9ab" ON "logs" ("api_key", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7056f5a1dd6067eaae0b09ed9a" ON "logs" ("client_id", "created_at") `,
    );
    await queryRunner.query(
      `ALTER TABLE "logs" ADD CONSTRAINT "FK_1aa17ee81ccc60e7bff31f17329" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "logs" DROP CONSTRAINT "FK_1aa17ee81ccc60e7bff31f17329"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7056f5a1dd6067eaae0b09ed9a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_576230dd0af7eb2dcf9a88f9ab"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_106185d572e56677adcfb55d36"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1aa17ee81ccc60e7bff31f1732"`,
    );
    await queryRunner.query(`DROP TABLE "logs"`);
  }
}
