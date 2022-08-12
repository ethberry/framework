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
        1601001
      ), (
        1601002
      ), (
        1601003
      ), (
        1601004
      ), (
        1601005
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 601005, true);`);

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
        601001,
        'Sword Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        1601001,
        0,
        4,
        'ACTIVE',
        601,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        601002,
        'Sword Mysterybox Inactive',
        '${simpleFormatting}',
        '${imageUrl}',
        1601002,
        0,
        1,
        'INACTIVE',
        601,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        601003,
        'Warrior Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        1601003,
        0,
        1,
        'ACTIVE',
        601,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        601004,
        'Gold Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        1601004,
        0,
        1,
        'ACTIVE',
        601,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        601005,
        'Mixed Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        1601005,
        0,
        1,
        'ACTIVE',
        601,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 601005, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
