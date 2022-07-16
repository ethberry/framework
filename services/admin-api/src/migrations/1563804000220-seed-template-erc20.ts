import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateErc20At1563804000220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.template (
        id,
        title,
        description,
        image_url,
        price_id,
        cap,
        amount,
        template_status,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        10001,
        'Native token (ETH)',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10002,
        'Space Credits',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        'ACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10003,
        'Inactive token',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        'INACTIVE',
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10004,
        'New token',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        'ACTIVE',
        4,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10005,
        'Black list token',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        'ACTIVE',
        5,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10006,
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        6,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 10006, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
