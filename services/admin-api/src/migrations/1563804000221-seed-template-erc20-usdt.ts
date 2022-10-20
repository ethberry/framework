import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateErc20USDTAt1563804000221 implements MigrationInterface {
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
        120501,
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        1205,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        220501,
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        2205,
        '${currentDateTime}',
        '${currentDateTime}'
      ),(
        320501,
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        3205,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        420501,
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        4205,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 4205001, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
