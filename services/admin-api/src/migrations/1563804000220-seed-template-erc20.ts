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
        120101,
        'Space Credits',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        'ACTIVE',
        1201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        120201,
        'Inactive token',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        'INACTIVE',
        1202,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        120301,
        'New token',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        'ACTIVE',
        1203,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        120401,
        'Black list token',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '${constants.WeiPerEther.mul(1e6).toString()}',
        'ACTIVE',
        1204,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 1204001, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
