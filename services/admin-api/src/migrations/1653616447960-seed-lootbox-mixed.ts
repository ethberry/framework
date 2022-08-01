import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedLootboxMixedAt1653616447960 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        36101
      ), (
        36111
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 60502, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC20',
        2,
        12002, -- space credit
        '${constants.WeiPerEther.toString()}',
        36101
      ), (
        'ERC721',
        16,
        13101, -- sword
        '1',
        36101
      ), (
        'ERC998',
        26,
        14101, -- warrior
        '1',
        36101
      ), (
        'ERC1155',
        31,
        15101, -- gold
        '1000',
        36101
      ), (
        'ERC20',
        2,
        12002, -- space credit
        '${constants.WeiPerEther.toString()}',
        36111
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.lootbox (
        title,
        description,
        image_url,
        item_id,
        price_id,
        template_id,
        lootbox_status,
        created_at,
        updated_at
      ) VALUES (
        'Mixed Lootbox',
        '${simpleFormatting}',
        '${imageUrl}',
        36101,
        36111,
        16105,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.lootbox RESTART IDENTITY CASCADE;`);
  }
}
