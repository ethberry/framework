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
        50103
      ), (
        50104
      ), (
        50105
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.grade (
        grade_strategy,
        attribute,
        growth_rate,
        price_id,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        'FLAT',
        'LEVEL',
        0,
        50101,
        10305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'EXPONENTIAL',
        'LEVEL',
        0,
        50102,
        10306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'LINEAR',
        'LEVEL',
        1,
        50103,
        10405,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'LINEAR',
        'LEVEL',
        1,
        50104,
        10406, -- hero
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'LINEAR',
        'LEVEL',
        1,
        50105,
        10380, -- under armour
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.grade RESTART IDENTITY CASCADE;`);
  }
}
