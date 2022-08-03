import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateErc721At1563804000230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        13101
      ), (
        13102
      ), (
        13103
      ), (
        13501
      ), (
        13502
      ), (
        13503
      ), (
        13504
      ), (
        13505
      ), (
        13506
      ), (
        13507
      ), (
        13508
      ), (
        13601
      ), (
        13602
      ), (
        13603
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 13508, true);`);

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
        13101,
        'Physical resistance',
        '${simpleFormatting}',
        '${imageUrl}',
        13101,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13102,
        'Magic resistance',
        '${simpleFormatting}',
        '${imageUrl}',
        13102,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13103,
        'Ward save',
        '${simpleFormatting}',
        '${imageUrl}',
        13103,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13501,
        'Chain mail',
        '${simpleFormatting}',
        '${imageUrl}',
        13501,
        0,
        1,
        'ACTIVE',
        15,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13502,
        'Helmet',
        '${simpleFormatting}',
        '${imageUrl}',
        13502,
        0,
        1,
        'ACTIVE',
        15,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13503,
        'Gloves',
        '${simpleFormatting}',
        '${imageUrl}',
        13503,
        0,
        1,
        'ACTIVE',
        15,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13504,
        'Boots',
        '${simpleFormatting}',
        '${imageUrl}',
        13504,
        0,
        1,
        'ACTIVE',
        15,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13505,
        'Necklace',
        '${simpleFormatting}',
        '${imageUrl}',
        13505,
        0,
        1,
        'ACTIVE',
        15,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13506,
        'Gold Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        13506,
        0,
        1,
        'ACTIVE',
        15,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13507,
        'Silver Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        13507,
        0,
        1,
        'ACTIVE',
        15,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13508,
        'Yellow pants',
        '${simpleFormatting}',
        '${imageUrl}',
        13508,
        0,
        1,
        'ACTIVE',
        15,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13601,
        'Sword',
        '${simpleFormatting}',
        '${imageUrl}',
        13601,
        0,
        4,
        'ACTIVE',
        16,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13602,
        'Mace',
        '${simpleFormatting}',
        '${imageUrl}',
        13602,
        0,
        1,
        'ACTIVE',
        16,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13603,
        'Axe',
        '${simpleFormatting}',
        '${imageUrl}',
        13603,
        0,
        1,
        'ACTIVE',
        16,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 13508, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
