import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedCraftErc1155Erc1155RecipesAt1653616448020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102010101
      ), (
        102010102
      ), (
        102010201
      ), (
        102010202
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
        10501,
        1050102, -- wood
        10,
        102010101
      ), (
        'ERC1155',
        10501,
        1050104, -- wood log
        1,
        102010102
      ), (
        'ERC1155',
        10501,
        1050103, -- iron
        10,
        102010201
      ), (
        'ERC1155',
        10501,
        1050105, -- iron ingot
        1,
        102010202
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.craft (
        id,
        item_id,
        price_id,
        craft_status,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        1050501,
        102010101,
        102010102,
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1050502,
        102010201,
        102010202,
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.craft RESTART IDENTITY CASCADE;`);
  }
}
