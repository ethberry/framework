import { MigrationInterface, QueryRunner } from "typeorm";

import { imageUrl, ns } from "@framework/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

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
        121501,
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        1215,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        221501,
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        2215,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        321501,
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        3215,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        421501,
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        4215,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
