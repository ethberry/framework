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
        1405, -- spell book
        1404, -- scroll
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
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
        1411, -- ec20 owner
        1201, -- space credit
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1413, -- ec20 + erc1155 owner
        1201, -- space credit
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1412, -- erc1155 owner
        1501, -- resources
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1413, -- ec20 + erc1155 owner
        1501, -- resources
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2401, -- bep
        2215, -- usdt
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2401, -- bep
        2216, -- weth
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2401, -- bep
        2217, -- busd
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
