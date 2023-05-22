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
        160101
      ), (
        160102
      ), (
        160401
      ), (
        160501
      ), (
        160601
      ), (
        260101
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
        160101,
        'Sword Mysterybox',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmysterybox.png?alt=media&token=868930d3-1afa-4f99-afca-c8a68310b259',
        160101,
        0,
        4,
        'ACTIVE',
        1601,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        160102,
        'Sword Mysterybox Inactive',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmysterybox.png?alt=media&token=868930d3-1afa-4f99-afca-c8a68310b259',
        160102,
        0,
        1,
        'INACTIVE',
        1601,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        160401,
        'Warrior Mysterybox',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmysterybox.png?alt=media&token=868930d3-1afa-4f99-afca-c8a68310b259',
        160401,
        0,
        1,
        'ACTIVE',
        1604,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        160501,
        'Gold Mysterybox',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmysterybox.png?alt=media&token=868930d3-1afa-4f99-afca-c8a68310b259',
        160501,
        0,
        1,
        'ACTIVE',
        1605,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        160601,
        'Mixed Mysterybox',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmysterybox.png?alt=media&token=868930d3-1afa-4f99-afca-c8a68310b259',
        160601,
        0,
        1,
        'ACTIVE',
        1606,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        260101,
        'Mysterybox (BEP)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fmysterybox.png?alt=media&token=868930d3-1afa-4f99-afca-c8a68310b259',
        260101,
        0,
        1,
        'ACTIVE',
        2601,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
