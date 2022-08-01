import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedCraftErc721Erc1155At1653616448030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        40201
      ), (
        40202
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 70202, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        16,
        13101, -- sword
        1,
        40201
      ), (
        'ERC1155',
        31,
        15102, -- wood
        10,
        40202
      ), (
        'ERC1155',
        31,
        15103, -- iron
        10,
        40202
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.craft (
        item_id,
        price_id,
        craft_status,
        created_at,
        updated_at
      ) VALUES (
        40201,
        40202,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.craft RESTART IDENTITY CASCADE;`);
  }
}
