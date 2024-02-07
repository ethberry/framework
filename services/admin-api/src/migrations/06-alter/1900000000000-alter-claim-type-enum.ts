import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class AlterClaimTypeEnum1900000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        alter type ${ns}.claim_type_enum ADD VALUE IF NOT EXISTS 'TEMPLATE';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`-- do nothing`);
  }
}
