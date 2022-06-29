import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedExchangeErc721Erc1155At1653616448030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id,
        external_id,
        asset_type
      ) VALUES (
        60201,
        60201,
        'EXCHANGE'
      ), (
        60202,
        60202,
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
        'ERC721',
        13,
        20101, -- sword
        1,
        60201
      ), (
        'ERC1155',
        31,
        40102, -- wood
        10,
        60202
      ), (
        'ERC1155',
        31,
        40103, -- iron
        10,
        60202
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
        60201,
        60202,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.exchange RESTART IDENTITY CASCADE;`);
  }
}
