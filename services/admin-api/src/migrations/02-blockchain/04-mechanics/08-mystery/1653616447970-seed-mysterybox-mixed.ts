import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { imageUrl, ns } from "@framework/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

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

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC20',
        10201,
        1020101, -- space credit
        '${WeiPerEther.toString()}',
        36101
      ), (
        'ERC721',
        10306,
        1030601, -- sword
        '1',
        36101
      ), (
        'ERC998',
        10406,
        1040601, -- warrior
        '1',
        36101
      ), (
        'ERC1155',
        10501,
        1050101, -- gold
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
        1110601,
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
