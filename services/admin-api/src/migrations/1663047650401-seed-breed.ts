import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedBreed1663047650401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.breed (
        id,
        genes,
        count,
        token_id,
        created_at,
        updated_at
      ) VALUES (
        1,
        '141467099517471456737901150254882731526927941072931743880',
        1,
        307001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        '141467099517471456737901150254882731526927941072931743880',
        1,
        307002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        '141467099517471456737901150254882731526927941072931743880',
        0,
        307003,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.breed RESTART IDENTITY CASCADE;`);
  }
}
