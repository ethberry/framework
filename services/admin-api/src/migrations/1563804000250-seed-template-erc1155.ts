import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedUniTemplateErc1155At1563804000250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const defaultJSON = JSON.stringify({});

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id,
        external_id,
        asset_type
      ) VALUES (
        40101,
        40101,
        'TEMPLATE'
      ), (
        40102,
        40102,
        'TEMPLATE'
      ), (
        40103,
        40103,
        'TEMPLATE'
      ), (
        40104,
        40104,
        'TEMPLATE'
      ), (
        40105,
        40105,
        'TEMPLATE'
      ), (
        40201,
        40201,
        'TEMPLATE'
      ), (
        40202,
        40202,
        'TEMPLATE'
      ), (
        40203,
        40203,
        'TEMPLATE'
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.uni_template (
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
        uni_contract_id,
        created_at,
        updated_at
      ) VALUES (
        40101,
        'Gold',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        40101,
        0,
        '${constants.WeiPerEther.toString()}',
        0,
        'ACTIVE',
        31,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40102,
        'Wood',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        40102,
        0,
        '${constants.WeiPerEther.toString()}',
        0,
        'ACTIVE',
        31,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40103,
        'Iron',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        40103,
        0,
        '${constants.WeiPerEther.toString()}',
        0,
        'ACTIVE',
        31,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40104,
        'Wood log',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        40104,
        0,
       '0',
        0,
        'ACTIVE',
        31,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40105,
        'Iron ingot',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        40105,
        0,
        '0',
        0,
        'ACTIVE',
        31,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40201,
        'Healing potion',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        40201,
        0,
        '0',
        0,
        'ACTIVE',
        32,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40202,
        'Mana potion',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        40202,
        0,
        '0',
        0,
        'ACTIVE',
        32,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40203,
        'Antidote',
        '${simpleFormatting}',
        '${imageUrl}',
        '${defaultJSON}',
        40203,
        0,
        '0',
        0,
        'ACTIVE',
        33,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.uni_template_id_seq', 40203, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.uni_template RESTART IDENTITY CASCADE;`);
  }
}
