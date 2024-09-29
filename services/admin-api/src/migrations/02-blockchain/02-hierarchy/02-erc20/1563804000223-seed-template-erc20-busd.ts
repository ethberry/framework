import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@ethberry/draft-js-utils";
import { NodeEnv } from "@ethberry/constants";
import { imagePath, ns } from "@framework/constants";

export class SeedTemplateErc20BusdAt1563804000223 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const busdImgUrl = `${imagePath}/busd.png`;

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
        ${process.env.NODE_ENV === NodeEnv.production ? 31 : 1021701},
        'BUSD',
        '${simpleFormatting}',
        '${busdImgUrl}',
        null,
        0,
        '31000000000000000000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 31 : 10217},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 32 : 2021701},
        'BUSD',
        '${simpleFormatting}',
        '${busdImgUrl}',
        null,
        0,
        '31000000000000000000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 32 : 20217},
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
