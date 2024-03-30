import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, imagePath } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTemplateErc20LinkAt1563804000224 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    const linkImgUrl = `${imagePath}/chainlink-coin-icon.png`;

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
        ${process.env.NODE_ENV === NodeEnv.production ? 33 : 1021801},
        'LINK',
        '${simpleFormatting}',
        '${linkImgUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 33 : 10218},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 34 : 2021801},
        'LINK',
        '${simpleFormatting}',
        '${linkImgUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 34 : 20218},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 35 : 3021801},
        'LINK',
        '${simpleFormatting}',
        '${linkImgUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 35 : 30218},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 36 : 4021801},
        'LINK',
        '${simpleFormatting}',
        '${linkImgUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 36 : 40218},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 37 : 5021801},
        'LINK',
        '${simpleFormatting}',
        '${linkImgUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 37 : 50218},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 67 : 6021801},
        'LINK',
        '${simpleFormatting}',
        '${linkImgUrl}',
        null,
        0,
        '100000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 67 : 60218},
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
