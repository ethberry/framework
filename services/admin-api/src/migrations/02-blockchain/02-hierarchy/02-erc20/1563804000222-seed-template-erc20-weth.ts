import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTemplateErc20WETHAt1563804000222 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
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
        1021601,
        'WETH',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fweth.png?alt=media&token=ea038e2a-c284-4727-bf24-ddf80bc96d46',
        null,
        0,
        '0',
        'ACTIVE',
        10216,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2021601,
        'WETH',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fweth.png?alt=media&token=ea038e2a-c284-4727-bf24-ddf80bc96d46',
        null,
        0,
        '0',
        'ACTIVE',
        20216,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3021601,
        'WETH',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fweth.png?alt=media&token=ea038e2a-c284-4727-bf24-ddf80bc96d46',
        null,
        0,
        '0',
        'ACTIVE',
        30216,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4021601,
        'WETH',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fweth.png?alt=media&token=ea038e2a-c284-4727-bf24-ddf80bc96d46',
        null,
        0,
        '0',
        'ACTIVE',
        40216,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
