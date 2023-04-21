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
      ), (
        220102
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.rent (
        title,
        price_id,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        'SHARE 25% to 75%',
        220101,
        1309,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'SHARE 50% to 50%',
        220101,
        1309,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'SHARE 75% to 25%',
         220101,
         1309,
         '${currentDateTime}',
         '${currentDateTime}'
      ), (
        'SHARE 25% to 75%',
        220102,
        1409,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'SHARE 50% to 50%',
        220102,
        1409,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'SHARE 75% to 25%',
        220102,
        1409,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.rent RESTART IDENTITY CASCADE;`);
  }
}
