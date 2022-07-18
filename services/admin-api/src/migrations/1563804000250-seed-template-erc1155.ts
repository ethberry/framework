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
        40101
      ), (
        40102
      ), (
        40103
      ), (
        40104
      ), (
        40105
      ), (
        40201
      ), (
        40202
      ), (
        40203
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
        40101,
        'Gold',
        '${simpleFormatting}',
        '${imageUrl}',
        40101,
        0,
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        31,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40102,
        'Wood',
        '${simpleFormatting}',
        '${imageUrl}',
        40102,
        0,
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        31,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40103,
        'Iron',
        '${simpleFormatting}',
        '${imageUrl}',
        40103,
        0,
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        31,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40104,
        'Wood log',
        '${simpleFormatting}',
        '${imageUrl}',
        40104,
        0,
       '0',
        'ACTIVE',
        31,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40105,
        'Iron ingot',
        '${simpleFormatting}',
        '${imageUrl}',
        40105,
        0,
        '0',
        'ACTIVE',
        31,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40201,
        'Healing potion',
        '${simpleFormatting}',
        '${imageUrl}',
        40201,
        0,
        '0',
        'ACTIVE',
        32,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40202,
        'Mana potion',
        '${simpleFormatting}',
        '${imageUrl}',
        40202,
        0,
        '0',
        'ACTIVE',
        32,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40203,
        'Antidote',
        '${simpleFormatting}',
        '${imageUrl}',
        40203,
        0,
        '0',
        'ACTIVE',
        33,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 40203, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
