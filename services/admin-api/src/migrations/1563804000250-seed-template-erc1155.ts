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
        1501001
      ), (
        1501002
      ), (
        1501003
      ), (
        1501004
      ), (
        1501005
      ), (
        1504001
      ), (
        1504002
      ), (
        1504003
      ), (
        1511001
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
        501001,
        'Gold',
        '${simpleFormatting}',
        '${imageUrl}',
        1501001,
        0,
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        501002,
        'Wood',
        '${simpleFormatting}',
        '${imageUrl}',
        1501002,
        0,
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        501003,
        'Iron',
        '${simpleFormatting}',
        '${imageUrl}',
        1501003,
        0,
        '${constants.WeiPerEther.toString()}',
        'ACTIVE',
        501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        501004,
        'Wood log',
        '${simpleFormatting}',
        '${imageUrl}',
        1501004,
        0,
       '0',
        'ACTIVE',
        501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        501005,
        'Iron ingot',
        '${simpleFormatting}',
        '${imageUrl}',
        1501004,
        0,
        '0',
        'ACTIVE',
        501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        504001,
        'Healing potion',
        '${simpleFormatting}',
        '${imageUrl}',
        1504001,
        0,
        '0',
        'ACTIVE',
        504,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        504002,
        'Mana potion',
        '${simpleFormatting}',
        '${imageUrl}',
        1504002,
        0,
        '0',
        'ACTIVE',
        504,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        504003,
        'Antidote',
        '${simpleFormatting}',
        '${imageUrl}',
        1504003,
        0,
        '0',
        'ACTIVE',
        504,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        511001,
        'BEP',
        '${simpleFormatting}',
        '${imageUrl}',
        1511001,
        0,
        '0',
        'ACTIVE',
        511,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.template_id_seq', 511001, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
