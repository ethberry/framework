import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateErc998At1563804000240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        1406001
      ), (
        1406002
      ), (
        1406003
      ), (
        1411001
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 411001, true);`);

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
        406001,
        'Warrior',
        '${simpleFormatting}',
        '${imageUrl}',
        1406001,
        0,
        1,
        'ACTIVE',
        406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        406002,
        'Rouge',
        '${simpleFormatting}',
        '${imageUrl}',
        1406002,
        0,
        1,
        'ACTIVE',
        406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        406003,
        'Mage',
        '${simpleFormatting}',
        '${imageUrl}',
        1406003,
        0,
        1,
        'ACTIVE',
        406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        411001,
        'BEP',
        '${simpleFormatting}',
        '${imageUrl}',
        1411001,
        0,
        1,
        'ACTIVE',
        411,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 411003, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
