import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedUniTemplateErc20At1563804000220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const defaultJSON = JSON.stringify({});

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id,
        external_id,
        asset_type
      ) VALUES (
        10101,
        10101,
        'TEMPLATE'
      ), (
        10102,
        10102,
        'TEMPLATE'
      ), (
        10103,
        10103,
        'TEMPLATE'
      ), (
        10104,
        10104,
        'TEMPLATE'
      ), (
        10105,
        10105,
        'TEMPLATE'
      ), (
        10106,
        10106,
        'TEMPLATE'
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.uni_template (
        id,
        title,
        description,
        image_url,
        attributes,
        price_id,
        cap,
        amount,
        decimals,
        template_status,
        uni_contract_id,
        created_at,
        updated_at
      ) VALUES (
        10001,
        'Native token (ETH)',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        18,
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10002,
        'Space Credits',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        18,
        'ACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10003,
        'Inactive token',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        18,
        'INACTIVE',
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10004,
        'New token',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        18,
        'ACTIVE',
        4,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10005,
        'Black list token',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        18,
        'ACTIVE',
        5,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10006,
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        18,
        'ACTIVE',
        6,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.uni_template RESTART IDENTITY CASCADE;`);
  }
}
