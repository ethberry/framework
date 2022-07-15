import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateErc998At1563804000240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const defaultJSON = JSON.stringify({});

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id,
        external_id,
        asset_type
      ) VALUES (
        30101,
        30101,
        'TEMPLATE'
      ), (
        30102,
        30102,
        'TEMPLATE'
      ), (
        30103,
        30103,
        'TEMPLATE'
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.template (
        id,
        title,
        description,
        image_url,
        attributes,
        price_id,
        cap,
        amount,
        template_status,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        30101,
        'Warrior',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        30101,
        0,
        1,
        'ACTIVE',
        21,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        30102,
        'Rouge',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        30102,
        0,
        1,
        'ACTIVE',
        21,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        30103,
        'Mage',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        30103,
        0,
        1,
        'ACTIVE',
        21,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 30103, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
