import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedTemplateErc1155At1563804000250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        150101
      ), (
        150102
      ), (
        150103
      ), (
        150104
      ), (
        150105
      ), (
        150401
      ), (
        150402
      ), (
        150403
      ), (
        250101
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 2501001, true);`);

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
        150101,
        'Gold',
        '${simpleFormatting}',
        '${imageUrl}',
        150101,
        0,
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        1501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        150102,
        'Wood',
        '${simpleFormatting}',
        '${imageUrl}',
        150102,
        0,
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        1501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        150103,
        'Iron',
        '${simpleFormatting}',
        '${imageUrl}',
        150103,
        0,
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        1501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        150104,
        'Wood log',
        '${simpleFormatting}',
        '${imageUrl}',
        150104,
        0,
       '0',
        'ACTIVE',
        1501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        150105,
        'Iron ingot',
        '${simpleFormatting}',
        '${imageUrl}',
        150104,
        0,
        '0',
        'ACTIVE',
        1501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        150401,
        'Healing potion',
        '${simpleFormatting}',
        '${imageUrl}',
        150401,
        0,
        '0',
        'ACTIVE',
        1504,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        150402,
        'Mana potion',
        '${simpleFormatting}',
        '${imageUrl}',
        150402,
        0,
        '0',
        'ACTIVE',
        1504,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        150403,
        'Antidote',
        '${simpleFormatting}',
        '${imageUrl}',
        150403,
        0,
        '0',
        'ACTIVE',
        1504,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        250101,
        'BEP',
        '${simpleFormatting}',
        '${imageUrl}',
        250101,
        0,
        '0',
        'ACTIVE',
        2501,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 2501001, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
