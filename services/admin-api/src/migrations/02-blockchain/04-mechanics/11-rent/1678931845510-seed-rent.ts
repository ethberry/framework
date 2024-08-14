import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedRent1678931845510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

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
        rent_status,
        created_at,
        updated_at
      ) VALUES (
        'SHARE 25% to 75%',
        220101,
        10309,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'SHARE 50% to 50%',
        220101,
        10309,
        'ACTIVE',  
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'SHARE 75% to 25%',
         220101,
         10309,
        'INACTIVE',
        '${currentDateTime}',
         '${currentDateTime}'
      ), (
        'SHARE 25% to 75%',
        220102,
        10409,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'SHARE 50% to 50%',
        220102,
        10409,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'SHARE 75% to 25%',
        220102,
        10409,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.rent RESTART IDENTITY CASCADE;`);
  }
}
