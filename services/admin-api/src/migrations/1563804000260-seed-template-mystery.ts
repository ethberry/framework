import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

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
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 1606001, true);`);

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
        '${imageUrl}',
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
        '${imageUrl}',
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
        '${imageUrl}',
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
        '${imageUrl}',
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
        '${imageUrl}',
        160601,
        0,
        1,
        'ACTIVE',
        1606,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
