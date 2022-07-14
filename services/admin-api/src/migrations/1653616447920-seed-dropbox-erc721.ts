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
      ), (
        60102,
        60102,
        'DROPBOX'
      ), (
        60201,
        60201,
        'DROPBOX'
      ), (
        60202,
        60202,
        'DROPBOX'
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        token_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        2,
        20101, -- sword
        '1',
        60101
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        60102
      ), (
        'ERC998',
        2,
        30101, -- warrior
        '1',
        60201
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        60202
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.dropbox (
        title,
        description,
        image_url,
        item_id,
        price_id,
        dropbox_status,
        contract_id,
        template_id,
        created_at,
        updated_at
      ) VALUES (
        'Sword Dropbox',
        '${simpleFormatting}',
        '${imageUrl}',
        60101,
        60102,
        'ACTIVE',
        12,
        20101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Warrior Dropbox',
        '${simpleFormatting}',
        '${imageUrl}',
        60201,
        60202,
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
