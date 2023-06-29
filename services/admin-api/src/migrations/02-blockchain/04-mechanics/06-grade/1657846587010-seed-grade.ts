import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedGrade1657846587010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102000301
      ), (
        102000302
      ), (
        102000308
      ), (
        102000401
      ), (
        102000402
      ), (
        102000408
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.grade (
        id,
        grade_strategy,
        attribute,
        growth_rate,
        price_id,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        10301,
        'FLAT',
        'LEVEL',
        0,
        102000301,
        10305, -- Armour
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10302,
        'EXPONENTIAL',
        'LEVEL',
        0,
        102000302,
        10306, -- Weapon
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10308,
        'LINEAR',
        'LEVEL',
        1,
        102000308,
        10380, -- Under Armour
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10401,
        'LINEAR',
        'LEVEL',
        1,
        102000401,
        10405, -- Spell book
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10402,
        'LINEAR',
        'LEVEL',
        1,
        102000402,
        10406, -- Heros
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10408,
        'LINEAR',
        'LEVEL',
        1,
        102000308,
        10480, -- Anti-heros
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.grade RESTART IDENTITY CASCADE;`);
  }
}
