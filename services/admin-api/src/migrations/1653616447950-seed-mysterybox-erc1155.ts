import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedMysteryboxErc1155At1653616447950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        35101
      ), (
        35111
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 65102, true);`);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC1155',
        51,
        15101, -- gold
        '1000',
        35101
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        35111
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.mysterybox (
        title,
        description,
        image_url,
        item_id,
        price_id,
        template_id,
        mysterybox_status,
        created_at,
        updated_at
      ) VALUES (
        'Gold Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        35101,
        35111,
        16104,
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
