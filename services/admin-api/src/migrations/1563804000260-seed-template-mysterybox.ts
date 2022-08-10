import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateMysteryboxAt1563804000260 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        16101
      ), (
        16102
      ), (
        16103
      ), (
        16104
      ), (
        16105
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 16105, true);`);

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
        16101,
        'Sword Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        16101,
        0,
        4,
        'ACTIVE',
        61,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        16102,
        'Sword Mysterybox Inactive',
        '${simpleFormatting}',
        '${imageUrl}',
        16105,
        0,
        1,
        'INACTIVE',
        61,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        16103,
        'Warrior Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        16102,
        0,
        1,
        'ACTIVE',
        61,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        16104,
        'Gold Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        16103,
        0,
        1,
        'ACTIVE',
        61,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        16105,
        'Mixed Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        16104,
        0,
        1,
        'ACTIVE',
        61,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 16105, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
