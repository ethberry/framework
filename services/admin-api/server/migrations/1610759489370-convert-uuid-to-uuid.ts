import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@gemunion/framework-constants-misc";

export class ConvertUuidToUuid1610759489370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`alter table ${ns}.token alter column uuid type uuid using uuid::uuid;`);
    await queryRunner.query(`alter table ${ns}.token alter column uuid set default uuid_generate_v4();`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`alter table ${ns}.token alter column uuid type varchar using uuid::varchar;`);
  }
}
