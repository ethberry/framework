import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedCraftErc1155Erc1155At1653616448020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        40101
      ), (
        40102
      ), (
        40111
      ), (
        40112
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 70112, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC1155',
        31,
        15102, -- wood
        1,
        40101
      ), (
        'ERC1155',
        31,
        15103, -- iron
        10,
        40111
      ), (
        'ERC1155',
        31,
        15104, -- wood log
        1,
        40102
      ), (
        'ERC1155',
        31,
        15105, -- iron ingot
        10,
        40112
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.craft (
        item_id,
        ingredients_id,
        craft_status,
        created_at,
        updated_at
      ) VALUES (
        40101,
        40111,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40102,
        40112,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.craft RESTART IDENTITY CASCADE;`);
  }
}
