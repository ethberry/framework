import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class AlterMerchant1687519905550 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `alter table ${ns}.merchant add column rate_plan ${ns}.rate_plan_enum default 'GOLD' not null;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`alter table ${ns}.merchant drop column rate_plan;`);
  }
}
