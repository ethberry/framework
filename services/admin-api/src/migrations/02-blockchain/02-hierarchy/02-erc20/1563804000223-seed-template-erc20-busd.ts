import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTemplateErc20BusdAt1563804000223 implements MigrationInterface {
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
        ${process.env.NODE_ENV === NodeEnv.production ? 31 : 1021701},
        'BUSD',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-framework-production.appspot.com/o/DO_NOT_REMOVE%2Fbinance.png?alt=media&token=2011b811-d158-46ec-b883-2fefed3f4fa0',
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
        'https://firebasestorage.googleapis.com/v0/b/gemunion-framework-production.appspot.com/o/DO_NOT_REMOVE%2Fbinance.png?alt=media&token=2011b811-d158-46ec-b883-2fefed3f4fa0',
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
