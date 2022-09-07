import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedMysteryboxMixedAt1653616447970 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        36101
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
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        36101
      ), (
        'ERC721',
        306,
        306001, -- sword
        '1',
        36101
      ), (
        'ERC998',
        406,
        406001, -- warrior
        '1',
        36101
      ), (
        'ERC1155',
        501,
        501001, -- gold
        '1000',
        36101
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.mysterybox (
        title,
        description,
        image_url,
        item_id,
        template_id,
        mysterybox_status,
        created_at,
        updated_at
      ) VALUES (
        'Mixed Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        36101,
        606001,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.mysterybox RESTART IDENTITY CASCADE;`);
  }
}
