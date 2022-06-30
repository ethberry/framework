import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedDropboxErc721At1653616447920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id,
        external_id,
        asset_type
      ) VALUES (
        60101,
        60101,
        'DROPBOX'
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
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        60101
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.dropbox (
        title,
        description,
        image_url,
        price_id,
        dropbox_status,
        uni_contract_id,
        uni_template_id,
        created_at,
        updated_at
      ) VALUES (
        'Sword Dropbox',
        '${simpleFormatting}',
        '${imageUrl}',
        50101,
        'ACTIVE',
        12,
        20101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.dropbox RESTART IDENTITY CASCADE;`);
  }
}
