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
        1601001
      ), (
        1601002
      ), (
        1604001
      ), (
        1605001
      ), (
        1606001
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
        604001,
        'Warrior Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        1604001,
        0,
        1,
        'ACTIVE',
        604,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        605001,
        'Gold Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        1605001,
        0,
        1,
        'ACTIVE',
        605,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        606001,
        'Mixed Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        1606001,
        0,
        1,
        'ACTIVE',
        606,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 1605001, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
