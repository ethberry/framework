import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedCompositionAt1658980520010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.composition (
        parent_id,
        child_id,
        amount,
        created_at,
        updated_at
      ) VALUES (
        1406, -- hero
        1405, -- spell book
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1406, -- hero
        1305, -- armour
        5,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1406, -- hero
        1201, -- space credit
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1406, -- hero
        1501, -- resources
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1401, -- simple
        1201, -- space credit
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.composition RESTART IDENTITY CASCADE;`);
  }
}
