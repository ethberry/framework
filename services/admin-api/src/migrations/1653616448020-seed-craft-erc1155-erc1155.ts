import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedCraftErc1155Erc1155At1653616448020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        70101
      ), (
        70102
      ), (
        70111
      ), (
        70112
      );
    `);

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
        70101
      ), (
        'ERC1155',
        31,
        15103, -- iron
        10,
        70111
      ), (
        'ERC1155',
        31,
        15104, -- wood log
        1,
        70102
      ), (
        'ERC1155',
        31,
        15105, -- iron ingot
        10,
        70112
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
        70101,
        70111,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        70102,
        70112,
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
