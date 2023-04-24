import { MigrationInterface, QueryRunner } from "typeorm";

import { imageUrl, ns } from "@framework/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

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
        130401
      ), (
        130402
      ), (
        130403
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
        130802
      ), (
        130803
      ), (
        130901
      ), (
        130902
      ), (
        130903
      ), (
        230101
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
        'Poison resistance',
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
        130401,
        'Necklace',
        '${simpleFormatting}',
        '${imageUrl}',
        130401,
        0,
        1,
        'ACTIVE',
        1304,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130402,
        'Gold ring',
        '${simpleFormatting}',
        '${imageUrl}',
        130402,
        0,
        1,
        'ACTIVE',
        1304,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130403,
        'Silver ring',
        '${simpleFormatting}',
        '${imageUrl}',
        130403,
        0,
        1,
        'ACTIVE',
        1304,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130501,
        'Cuirass',
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
        'Cuisses',
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
        'Gauntlets',
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
        'Pauldrons',
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
        'Greaves',
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
        'Sabatons',
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
        130701,
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
        130802,
        'Cup',
        '${simpleFormatting}',
        '${imageUrl}',
        130802,
        0,
        1,
        'ACTIVE',
        1308,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130803,
        'Diploma',
        '${simpleFormatting}',
        '${imageUrl}',
        130803,
        0,
        1,
        'ACTIVE',
        1308,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130901,
        'Horse',
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
        130902,
        'Boat',
        '${simpleFormatting}',
        '${imageUrl}',
        130902,
        0,
        1,
        'ACTIVE',
        1309,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        130903,
        'Gyrocopter',
        '${simpleFormatting}',
        '${imageUrl}',
        130903,
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
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
