import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTemplateErc20LinkAt1563804000224 implements MigrationInterface {
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
        ${process.env.NODE_ENV === NodeEnv.production ? 33 : 1021801},
        'USDT',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fusdt.png?alt=media&token=fb224695-58f6-4014-aab9-2789b557a692',
        null,
        0,
        '100000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 33 : 10218},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 34 : 2021801},
        'USDT',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fusdt.png?alt=media&token=fb224695-58f6-4014-aab9-2789b557a692',
        null,
        0,
        '100000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 34 : 20218},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 35 : 3021801},
        'USDT',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fusdt.png?alt=media&token=fb224695-58f6-4014-aab9-2789b557a692',
        null,
        0,
        '100000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 35 : 30218},
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 36 : 4021801},
        'USDT',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fusdt.png?alt=media&token=fb224695-58f6-4014-aab9-2789b557a692',
        null,
        0,
        '100000000000',
        'ACTIVE',
        ${process.env.NODE_ENV === NodeEnv.production ? 36 : 40218},
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
