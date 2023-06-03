import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateErc20BUSDAt1563804000223 implements MigrationInterface {
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
        121701,
        'BUSD',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '31000000000000000000000000',
        'ACTIVE',
        1217,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        221701,
        'BUSD',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        0,
        '31000000000000000000000000',
        'ACTIVE',
        2217,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
