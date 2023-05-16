import { MigrationInterface, QueryRunner } from "typeorm";

import { imageUrl, ns } from "@framework/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

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
        121601,
        'WETH',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '0',
        'ACTIVE',
        1216,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        221601,
        'WETH',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '0',
        'ACTIVE',
        2216,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        321601,
        'WETH',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '0',
        'ACTIVE',
        3216,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        421601,
        'WETH',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '0',
        'ACTIVE',
        4216,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
