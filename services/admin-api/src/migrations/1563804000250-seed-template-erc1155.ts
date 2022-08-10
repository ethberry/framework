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
        15101
      ), (
        15102
      ), (
        15103
      ), (
        15104
      ), (
        15105
      ), (
        15201
      ), (
        15202
      ), (
        15203
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.asset_id_seq', 15203, true);`);

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
        15101,
        'Gold',
        '${simpleFormatting}',
        '${imageUrl}',
        15101,
        0,
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        51,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15102,
        'Wood',
        '${simpleFormatting}',
        '${imageUrl}',
        15102,
        0,
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        51,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15103,
        'Iron',
        '${simpleFormatting}',
        '${imageUrl}',
        15103,
        0,
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        51,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15104,
        'Wood log',
        '${simpleFormatting}',
        '${imageUrl}',
        15104,
        0,
       '0',
        'ACTIVE',
        51,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15105,
        'Iron ingot',
        '${simpleFormatting}',
        '${imageUrl}',
        15105,
        0,
        '0',
        'ACTIVE',
        51,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15201,
        'Healing potion',
        '${simpleFormatting}',
        '${imageUrl}',
        15201,
        0,
        '0',
        'ACTIVE',
        54,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15202,
        'Mana potion',
        '${simpleFormatting}',
        '${imageUrl}',
        15202,
        0,
        '0',
        'ACTIVE',
        54,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15203,
        'Antidote',
        '${simpleFormatting}',
        '${imageUrl}',
        15203,
        0,
        '0',
        'ACTIVE',
        54,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 15203, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
