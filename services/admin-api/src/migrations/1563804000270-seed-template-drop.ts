import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateDropAt1563804000270 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        17301
      ), (
        17401
      ), (
        17501
      ), (
        17601
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 17604, true);`);

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
        17301,
        'Item Drop',
        '${simpleFormatting}',
        '${imageUrl}',
        17301,
        0,
        4,
        'HIDDEN',
        16,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        17401,
        'Hero Drop',
        '${simpleFormatting}',
        '${imageUrl}',
        17401,
        0,
        1,
        'HIDDEN',
        26,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        17501,
        'Resource Drop',
        '${simpleFormatting}',
        '${imageUrl}',
        17501,
        0,
        1,
        'HIDDEN',
        31,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        17601,
        'Lootbox Drop',
        '${simpleFormatting}',
        '${imageUrl}',
        17601,
        0,
        1,
        'HIDDEN',
        41,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 17601, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
