import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, imagePath } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedTemplateErc20WethAt1563804000222 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const wethImgUrl = `${imagePath}/WETHlogo.png`;

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
        ${process.env.NODE_ENV === NodeEnv.production ? 21 : 1021601},
        'WETH',
        '${simpleFormatting}',
        '${wethImgUrl}',
        null,
        0,
        '0',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 21 : 10216},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 22 : 2021601},
        'WBNB',
        '${simpleFormatting}',
        '${wethImgUrl}',
        null,
        0,
        '0',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 22 : 20216},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 23 : 3021601},
        'WETH',
        '${simpleFormatting}',
        '${wethImgUrl}',
        null,
        0,
        '0',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 23 : 30216},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 24 : 4021601},
        'WMATIC',
        '${simpleFormatting}',
        '${wethImgUrl}',
        null,
        0,
        '0',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 24 : 40216},
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
