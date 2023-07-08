import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedTemplateErc20USDTAt1563804000221 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

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
        1021501,
        'USDT',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fusdt.png?alt=media&token=fb224695-58f6-4014-aab9-2789b557a692',
        null,
        0,
        '100000000000',
        'ACTIVE',
        10215,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2021501,
        'USDT',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fusdt.png?alt=media&token=fb224695-58f6-4014-aab9-2789b557a692',
        null,
        0,
        '100000000000',
        'ACTIVE',
        20215,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3021501,
        'USDT',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fusdt.png?alt=media&token=fb224695-58f6-4014-aab9-2789b557a692',
        null,
        0,
        '100000000000',
        'ACTIVE',
        30215,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4021501,
        'USDT',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fusdt.png?alt=media&token=fb224695-58f6-4014-aab9-2789b557a692',
        null,
        0,
        '100000000000',
        'ACTIVE',
        40215,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
