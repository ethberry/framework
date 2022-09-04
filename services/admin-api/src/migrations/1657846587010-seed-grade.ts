import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedGrade1657846587010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        50101
      ), (
        50102
      ), (
        50201
      ), (
        50202
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 50202, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.grade (
        grade_strategy,
        growth_rate,
        price_id,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        'FLAT',
        0,
        50101,
        305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'EXPONENTIAL',
        0,
        50102,
        306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'LINEAR',
        1,
        50201,
        405,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'EXPONENTIAL',
        1,
        50202,
        406, -- hero
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.grade RESTART IDENTITY CASCADE;`);
  }
}
