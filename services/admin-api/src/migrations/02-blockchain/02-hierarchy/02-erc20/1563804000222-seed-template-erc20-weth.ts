import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateErc20WETHAt1563804000222 implements MigrationInterface {
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
        120601,
        'WETH',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '0',
        'ACTIVE',
        1206,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        220601,
        'WETH',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '0',
        'ACTIVE',
        2206,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        320601,
        'WETH',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '0',
        'ACTIVE',
        3206,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        420601,
        'WETH',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '0',
        'ACTIVE',
        4206,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
