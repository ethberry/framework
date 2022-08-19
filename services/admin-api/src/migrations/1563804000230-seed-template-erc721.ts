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
        1301001
      ), (
        1301002
      ), (
        1301003
      ), (
        1305001
      ), (
        1305002
      ), (
        1305003
      ), (
        1305004
      ), (
        1305005
      ), (
        1305006
      ), (
        1305007
      ), (
        1305008
      ), (
        1306001
      ), (
        1306002
      ), (
        1306003
      ), (
        1307001
      ), (
        1311001
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 1311001, true);`);

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
        301001,
        'Physical resistance',
        '${simpleFormatting}',
        '${imageUrl}',
        1301001,
        0,
        1,
        'ACTIVE',
        301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        301002,
        'Magic resistance',
        '${simpleFormatting}',
        '${imageUrl}',
        1301002,
        0,
        1,
        'ACTIVE',
        301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        301003,
        'Ward save',
        '${simpleFormatting}',
        '${imageUrl}',
        1301003,
        0,
        1,
        'ACTIVE',
        301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305001,
        'Chain mail',
        '${simpleFormatting}',
        '${imageUrl}',
        1305001,
        0,
        1,
        'ACTIVE',
        305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305002,
        'Helmet',
        '${simpleFormatting}',
        '${imageUrl}',
        1305002,
        0,
        1,
        'ACTIVE',
        305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305003,
        'Gloves',
        '${simpleFormatting}',
        '${imageUrl}',
        1305003,
        0,
        1,
        'ACTIVE',
        305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305004,
        'Boots',
        '${simpleFormatting}',
        '${imageUrl}',
        1305004,
        0,
        1,
        'ACTIVE',
        305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305005,
        'Necklace',
        '${simpleFormatting}',
        '${imageUrl}',
        1305005,
        0,
        1,
        'ACTIVE',
        305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305006,
        'Gold Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        1305006,
        0,
        1,
        'ACTIVE',
        305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305007,
        'Silver Ring',
        '${simpleFormatting}',
        '${imageUrl}',
        1305007,
        0,
        1,
        'ACTIVE',
        305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305008,
        'Yellow pants',
        '${simpleFormatting}',
        '${imageUrl}',
        1305008,
        0,
        1,
        'ACTIVE',
        305,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        306001,
        'Sword',
        '${simpleFormatting}',
        '${imageUrl}',
        1306001,
        0,
        4,
        'ACTIVE',
        306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        306002,
        'Mace',
        '${simpleFormatting}',
        '${imageUrl}',
        1306002,
        0,
        1,
        'ACTIVE',
        306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        306003,
        'Axe',
        '${simpleFormatting}',
        '${imageUrl}',
        1306003,
        0,
        1,
        'ACTIVE',
        306,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        307001,
        'Medal',
        '${simpleFormatting}',
        '${imageUrl}',
        1307001,
        0,
        1,
        'ACTIVE',
        307,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        311001,
        'BEP',
        '${simpleFormatting}',
        '${imageUrl}',
        1311001,
        0,
        1,
        'ACTIVE',
        311,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 311001, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
