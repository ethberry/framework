import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, imagePath } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTemplateErc20UsdtAt1563804000221 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const usdtImgUrl = `${imagePath}/usdt.png`;

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
        ${process.env.NODE_ENV === NodeEnv.production ? 11 : 1021501},
        'USDT',
        '${simpleFormatting}',
        '${usdtImgUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 11 : 10215},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 12 : 2021501},
        'USDT',
        '${simpleFormatting}',
        '${usdtImgUrl}',
        null,
        0,
        '0',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 12 : 20215},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 13 : 3021501},
        'USDT',
        '${simpleFormatting}',
        '${usdtImgUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 13 : 30215},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 14 : 4021501},
        'USDT',
        '${simpleFormatting}',
        '${usdtImgUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 14 : 40215},
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
