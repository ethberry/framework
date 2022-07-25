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
        13201
      ), (
        13202
      ), (
        13203
      ), (
        13204
      ), (
        13205
      ), (
        13206
      ), (
        13207
      ), (
        13208
      ), (
        13301
      ), (
        13302
      ), (
        13303
      ), (
        13401
      ), (
        13402
      ), (
        13403
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
        13101,
        'Sword',
        '${simpleFormatting}',
        '${imageUrl}',
        13101,
        0,
        4,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13102,
        'Mace',
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
        'Axe',
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
        13201,
        'Chain mail',
        '${simpleFormatting}',
        '${imageUrl}',
        13201,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13202,
        'Helmet',
        '${simpleFormatting}',
        '${imageUrl}',
        13202,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13203,
        'Gloves',
        '${simpleFormatting}',
        '${imageUrl}',
        13203,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13204,
        'Boots',
        '${simpleFormatting}',
        '${imageUrl}',
        13204,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13205,
        'Necklace',
        '${simpleFormatting}',
        '${imageUrl}',
        13205,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13206,
        'Gold Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        13206,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13207,
        'Silver Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        13207,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13208,
        'Yellow pants',
        '${simpleFormatting}',
        '${imageUrl}',
        13208,
        0,
        1,
        'ACTIVE',
        11,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13301,
        'Shield wall',
        '${simpleFormatting}',
        '${imageUrl}',
        13301,
        0,
        1,
        'ACTIVE',
        12,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13302,
        'Back stub',
        '${simpleFormatting}',
        '${imageUrl}',
        13302,
        0,
        1,
        'ACTIVE',
        12,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13303,
        'Fireball',
        '${simpleFormatting}',
        '${imageUrl}',
        13303,
        0,
        1,
        'ACTIVE',
        12,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13401,
        'Physical resistance',
        '${simpleFormatting}',
        '${imageUrl}',
        13401,
        0,
        1,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13402,
        'Magic resistance',
        '${simpleFormatting}',
        '${imageUrl}',
        13402,
        0,
        1,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13403,
        'Ward save',
        '${simpleFormatting}',
        '${imageUrl}',
        13403,
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
