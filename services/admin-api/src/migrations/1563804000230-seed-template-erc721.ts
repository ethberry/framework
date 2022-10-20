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
        130101
      ), (
        130102
      ), (
        130103
      ), (
        130501
      ), (
        130502
      ), (
        130503
      ), (
        130504
      ), (
        130505
      ), (
        130506
      ), (
        130507
      ), (
        130508
      ), (
        130601
      ), (
        130602
      ), (
        130603
      ), (
        130701
      ), (
        130801
      ), (
        130901
      ), (
        230101
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 230101, true);`);

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
        130101,
        'Physical resistance',
        '${simpleFormatting}',
        '${imageUrl}',
        130101,
        0,
        1,
        'ACTIVE',
        1301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130102,
        'Magic resistance',
        '${simpleFormatting}',
        '${imageUrl}',
        130102,
        0,
        1,
        'ACTIVE',
        1301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130103,
        'Ward save',
        '${simpleFormatting}',
        '${imageUrl}',
        130103,
        0,
        1,
        'ACTIVE',
        1301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130501,
        'Chain mail',
        '${simpleFormatting}',
        '${imageUrl}',
        130501,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130502,
        'Helmet',
        '${simpleFormatting}',
        '${imageUrl}',
        130502,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130503,
        'Gloves',
        '${simpleFormatting}',
        '${imageUrl}',
        130503,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130504,
        'Boots',
        '${simpleFormatting}',
        '${imageUrl}',
        130504,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130505,
        'Necklace',
        '${simpleFormatting}',
        '${imageUrl}',
        130505,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130506,
        'Gold Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        130506,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130507,
        'Silver Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        130507,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130508,
        'Yellow pants',
        '${simpleFormatting}',
        '${imageUrl}',
        130508,
        0,
        1,
        'ACTIVE',
        1305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130601,
        'Sword',
        '${simpleFormatting}',
        '${imageUrl}',
        130601,
        0,
        4,
        'ACTIVE',
        1306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130602,
        'Mace',
        '${simpleFormatting}',
        '${imageUrl}',
        130602,
        0,
        1,
        'ACTIVE',
        1306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130603,
        'Axe',
        '${simpleFormatting}',
        '${imageUrl}',
        130603,
        0,
        1,
        'ACTIVE',
        1306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130700,
        'AXIE (genes)(hidden)',
        '${simpleFormatting}',
        '${imageUrl}',
        null,
        '${(1024 * 1024 * 1024 * 4).toString()}',
        1,
        'HIDDEN',
        1307,
        '${currentDateTime}',
        '${currentDateTime}'
      ),(
        307001,
        'Axie',
        '${simpleFormatting}',
        '${imageUrl}',
        130701,
        0,
        1,
        'ACTIVE',
        1307,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130801,
        'Medal',
        '${simpleFormatting}',
        '${imageUrl}',
        130801,
        0,
        1,
        'ACTIVE',
        1308,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130901,
        'Generative (traits)',
        '${simpleFormatting}',
        '${imageUrl}',
        130901,
        0,
        1,
        'ACTIVE',
        1309,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        230101,
        'BEP',
        '${simpleFormatting}',
        '${imageUrl}',
        230101,
        0,
        1,
        'ACTIVE',
        2301,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 230101, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
