import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedComposition1658980520010 implements MigrationInterface {
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
        46, -- hero
        36, -- weapon
        5,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.composition RESTART IDENTITY CASCADE;`);
  }
}
