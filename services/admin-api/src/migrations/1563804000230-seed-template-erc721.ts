import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateErc721At1563804000230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const defaultJSON = JSON.stringify({});

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id,
        external_id,
        asset_type
      ) VALUES (
        20101,
        20101,
        'TEMPLATE'
      ), (
        20102,
        20102,
        'TEMPLATE'
      ), (
        20103,
        20103,
        'TEMPLATE'
      ), (
        20201,
        20201,
        'TEMPLATE'
      ), (
        20202,
        20202,
        'TEMPLATE'
      ), (
        20203,
        20203,
        'TEMPLATE'
      ), (
        20204,
        20204,
        'TEMPLATE'
      ), (
        20205,
        20205,
        'TEMPLATE'
      ), (
        20206,
        20206,
        'TEMPLATE'
      ), (
        20207,
        20207,
        'TEMPLATE'
      ), (
        20208,
        20208,
        'TEMPLATE'
      ), (
        20301,
        20301,
        'TEMPLATE'
      ), (
        20302,
        20302,
        'TEMPLATE'
      ), (
        20303,
        20303,
        'TEMPLATE'
      ), (
        20401,
        20401,
        'TEMPLATE'
      ), (
        20402,
        20402,
        'TEMPLATE'
      ), (
        20403,
        20403,
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
        decimals,
        template_status,
        contract_id,
        created_at,
        updated_at
      ) VALUES (
        20101,
        'Sword',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20101,
        0,
        4,
        0,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20102,
        'Mace',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20102,
        0,
        1,
        0,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20103,
        'Axe',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20103,
        0,
        1,
        0,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20201,
        'Chain mail',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20201,
        0,
        1,
        0,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20202,
        'Helmet',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20202,
        0,
        1,
        0,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20203,
        'Gloves',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20203,
        0,
        1,
        0,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20204,
        'Boots',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20204,
        0,
        1,
        0,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20205,
        'Necklace',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20205,
        0,
        1,
        0,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20206,
        'Gold Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20206,
        0,
        1,
        0,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20207,
        'Silver Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20207,
        0,
        1,
        0,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20208,
        'Yellow pants',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20208,
        0,
        1,
        0,
        'ACTIVE',
        13,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20301,
        'Shield wall',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20301,
        0,
        1,
        0,
        'ACTIVE',
        14,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20302,
        'Back stub',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20302,
        0,
        1,
        0,
        'ACTIVE',
        14,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20303,
        'Fireball',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20303,
        0,
        1,
        0,
        'ACTIVE',
        14,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20401,
        'Physical resistance',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20401,
        0,
        1,
        0,
        'ACTIVE',
        15,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20402,
        'Magic resistance',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20402,
        0,
        1,
        0,
        'ACTIVE',
        15,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20403,
        'Ward save',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        20403,
        0,
        1,
        0,
        'ACTIVE',
        15,
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
