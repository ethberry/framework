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
        13601
      ), (
        13602
      ), (
        13603
      ), (
        13604
      ), (
        13605
      ), (
        13606
      ), (
        13607
      ), (
        13608
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 13608, true);`);

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
        'Sword',
        '${simpleFormatting}',
        '${imageUrl}',
        13501,
        0,
        4,
        'ACTIVE',
        15,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13502,
        'Mace',
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
        'Axe',
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
        13601,
        'Chain mail',
        '${simpleFormatting}',
        '${imageUrl}',
        13601,
        0,
        1,
        'ACTIVE',
        16,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13602,
        'Helmet',
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
        'Gloves',
        '${simpleFormatting}',
        '${imageUrl}',
        13603,
        0,
        1,
        'ACTIVE',
        16,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13604,
        'Boots',
        '${simpleFormatting}',
        '${imageUrl}',
        13604,
        0,
        1,
        'ACTIVE',
        16,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13605,
        'Necklace',
        '${simpleFormatting}',
        '${imageUrl}',
        13605,
        0,
        1,
        'ACTIVE',
        16,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13606,
        'Gold Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        13606,
        0,
        1,
        'ACTIVE',
        16,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13607,
        'Silver Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        13607,
        0,
        1,
        'ACTIVE',
        16,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13608,
        'Yellow pants',
        '${simpleFormatting}',
        '${imageUrl}',
        13608,
        0,
        1,
        'ACTIVE',
        16,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 13608, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
