import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedLootboxErc721At1653616447920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        60101
      ), (
        60102
      ), (
        60201
      ), (
        60202
      ), (
        60301
      ), (
        60302
      ), (
        60401
      ), (
        60402
      ), (
        60501
      ), (
        60502
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
        'ERC721',
        16,
        13101, -- sword
        '1',
        60101
      ), (
        'ERC20',
        2,
        12002, -- space credit
        '${constants.WeiPerEther.toString()}',
        60102
      ), (
        'ERC998',
        26,
        14101, -- warrior
        '1',
        60201
      ), (
        'ERC20',
        2,
        12002, -- space credit
        '${constants.WeiPerEther.toString()}',
        60202
      ), (
        'ERC1155',
        31,
        15101, -- gold
        '1000',
        60301
      ), (
        'ERC20',
        2,
        12002, -- space credit
        '${constants.WeiPerEther.toString()}',
        60302
      ), (
        'ERC721',
        16,
        13101, -- sword
        '1',
        60401
      ), (
        'ERC998',
        26,
        14101, -- warrior
        '1',
        60401
      ), (
        'ERC1155',
        31,
        15101, -- gold
        '1000',
        60401
      ), (
        'ERC20',
        2,
        12002, -- space credit
        '${constants.WeiPerEther.toString()}',
        60402
      ), (
        'ERC721',
        16,
        13101, -- sword
        '1',
        60501
      ), (
        'ERC20',
        2,
        12002, -- space credit
        '${constants.WeiPerEther.toString()}',
        60502
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
        'Sword Lootbox',
        '${simpleFormatting}',
        '${imageUrl}',
        60101,
        60102,
        16101,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Warrior Lootbox',
        '${simpleFormatting}',
        '${imageUrl}',
        60201,
        60202,
        16102,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Gold Lootbox',
        '${simpleFormatting}',
        '${imageUrl}',
        60301,
        60302,
        16103,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Mixed Lootbox',
        '${simpleFormatting}',
        '${imageUrl}',
        60401,
        60402,
        16104,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Inactive Lootbox',
        '${simpleFormatting}',
        '${imageUrl}',
        60501,
        60502,
        16105,
        'INACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.lootbox RESTART IDENTITY CASCADE;`);
  }
}
