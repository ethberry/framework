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
        20101
      ), (
        20102
      ), (
        20103
      ), (
        20201
      ), (
        20202
      ), (
        20203
      ), (
        20204
      ), (
        20205
      ), (
        20206
      ), (
        20207
      ), (
        20208
      ), (
        20301
      ), (
        20302
      ), (
        20303
      ), (
        20401
      ), (
        20402
      ), (
        20403
      );
    `);

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
        20101,
        'Sword',
        '${simpleFormatting}',
        '${imageUrl}',
        20101,
        0,
        4,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20102,
        'Mace',
        '${simpleFormatting}',
        '${imageUrl}',
        20102,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20103,
        'Axe',
        '${simpleFormatting}',
        '${imageUrl}',
        20103,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20201,
        'Chain mail',
        '${simpleFormatting}',
        '${imageUrl}',
        20201,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20202,
        'Helmet',
        '${simpleFormatting}',
        '${imageUrl}',
        20202,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20203,
        'Gloves',
        '${simpleFormatting}',
        '${imageUrl}',
        20203,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20204,
        'Boots',
        '${simpleFormatting}',
        '${imageUrl}',
        20204,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20205,
        'Necklace',
        '${simpleFormatting}',
        '${imageUrl}',
        20205,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20206,
        'Gold Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        20206,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20207,
        'Silver Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        20207,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20208,
        'Yellow pants',
        '${simpleFormatting}',
        '${imageUrl}',
        20208,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20301,
        'Shield wall',
        '${simpleFormatting}',
        '${imageUrl}',
        20301,
        0,
        1,
        'ACTIVE',
        12,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20302,
        'Back stub',
        '${simpleFormatting}',
        '${imageUrl}',
        20302,
        0,
        1,
        'ACTIVE',
        12,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20303,
        'Fireball',
        '${simpleFormatting}',
        '${imageUrl}',
        20303,
        0,
        1,
        'ACTIVE',
        12,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20401,
        'Physical resistance',
        '${simpleFormatting}',
        '${imageUrl}',
        20401,
        0,
        1,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20402,
        'Magic resistance',
        '${simpleFormatting}',
        '${imageUrl}',
        20402,
        0,
        1,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20403,
        'Ward save',
        '${simpleFormatting}',
        '${imageUrl}',
        20403,
        0,
        1,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 20403, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
