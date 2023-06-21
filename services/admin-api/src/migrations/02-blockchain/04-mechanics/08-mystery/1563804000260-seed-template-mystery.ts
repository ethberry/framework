import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedTemplateMysteryAt1563804000260 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        101110101
      ), (
        101110102
      ), (
        101110401
      ), (
        101110501
      ), (
        101110601
      ), (
        201110101
      );
    `);

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
        1110101,
        'Sword Mysterybox',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmysterybox.png?alt=media&token=868930d3-1afa-4f99-afca-c8a68310b259',
        101110101,
        0,
        4,
        'ACTIVE',
        11101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1110102,
        'Sword Mysterybox Inactive',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmysterybox.png?alt=media&token=868930d3-1afa-4f99-afca-c8a68310b259',
        101110102,
        0,
        1,
        'INACTIVE',
        11101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1110401,
        'Warrior Mysterybox',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmysterybox.png?alt=media&token=868930d3-1afa-4f99-afca-c8a68310b259',
        101110401,
        0,
        1,
        'ACTIVE',
        11104,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1110501,
        'Gold Mysterybox',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmysterybox.png?alt=media&token=868930d3-1afa-4f99-afca-c8a68310b259',
        101110501,
        0,
        1,
        'ACTIVE',
        11105,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1110601,
        'Mixed Mysterybox',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmysterybox.png?alt=media&token=868930d3-1afa-4f99-afca-c8a68310b259',
        101110601,
        0,
        1,
        'ACTIVE',
        11106,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2110101,
        'Mysterybox (BEP)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmysterybox.png?alt=media&token=868930d3-1afa-4f99-afca-c8a68310b259',
        201110101,
        0,
        1,
        'ACTIVE',
        21101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
