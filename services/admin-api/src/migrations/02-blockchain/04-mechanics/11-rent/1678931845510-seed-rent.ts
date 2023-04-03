import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedRent1678931845510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        220101
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.rent (
        price_id,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        220101,
        1309,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.rent RESTART IDENTITY CASCADE;`);
  }
}
