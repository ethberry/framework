import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedCompositionAt1658980520010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.composition (
        parent_id,
        child_id,
        amount,
        created_at,
        updated_at
      ) VALUES (
        10405, -- spell book
        10404, -- scroll
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10406, -- hero
        10405, -- spell book
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10406, -- hero
        10305, -- armour
        5,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10411, -- ec20 owner
        10201, -- space credit
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10413, -- ec20 + erc1155 owner
        10201, -- space credit
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10412, -- erc1155 owner
        10501, -- resources
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10413, -- ec20 + erc1155 owner
        10501, -- resources
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20401, -- bep
        20215, -- usdt
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20401, -- bep
        20216, -- weth
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20401, -- bep
        20217, -- busd
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
