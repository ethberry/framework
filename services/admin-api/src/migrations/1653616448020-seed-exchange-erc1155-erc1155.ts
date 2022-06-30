import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedExchangeErc1155Erc1155At1653616448020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id,
        external_id,
        asset_type
      ) VALUES (
        70101,
        70101,
        'EXCHANGE'
      ), (
        70102,
        70102,
        'EXCHANGE'
      ), (
        70111,
        70111,
        'EXCHANGE'
      ), (
        70112,
        70112,
        'EXCHANGE'
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        uni_contract_id,
        uni_token_id,
        amount,
        asset_id
      ) VALUES (
        'ERC1155',
        31,
        40102, -- wood
        1,
        70101
      ), (
        'ERC1155',
        31,
        40103, -- iron
        10,
        70111
      ), (
        'ERC1155',
        31,
        40104, -- wood log
        1,
        70102
      ), (
        'ERC1155',
        31,
        40105, -- iron ingot
        10,
        70112
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.exchange (
        item_id,
        ingredients_id,
        exchange_status,
        created_at,
        updated_at
      ) VALUES (
        70101,
        70111,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        70102,
        70112,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.exchange RESTART IDENTITY CASCADE;`);
  }
}
