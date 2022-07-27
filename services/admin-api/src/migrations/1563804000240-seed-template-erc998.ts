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
        14101
      ), (
        14102
      ), (
        14103
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 14103, true);`);

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
        14101,
        'Warrior',
        '${simpleFormatting}',
        '${imageUrl}',
        14101,
        0,
        1,
        'ACTIVE',
        26,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        14102,
        'Rouge',
        '${simpleFormatting}',
        '${imageUrl}',
        14102,
        0,
        1,
        'ACTIVE',
        26,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        14103,
        'Mage',
        '${simpleFormatting}',
        '${imageUrl}',
        14103,
        0,
        1,
        'ACTIVE',
        26,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 14103, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
