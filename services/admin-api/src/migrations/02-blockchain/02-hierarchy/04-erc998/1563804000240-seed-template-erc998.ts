import { MigrationInterface, QueryRunner } from "typeorm";

import { imageUrl, ns } from "@framework/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedTemplateErc998At1563804000240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        140101
      ), (
        140501
      ), (
        140502
      ), (
        140601
      ), (
        140602
      ), (
        140603
      ), (
        140701
      ), (
        140901
      ), (
        141101
      ), (
        141201
      ), (
        141301
      ), (
        240101
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
        140101,
        'Bag',
        '${simpleFormatting}',
        '${imageUrl}',
        140101,
        0,
        1,
        'ACTIVE',
        1401,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140501,
        'Scroll',
        '${simpleFormatting}',
        '${imageUrl}',
        140501,
        0,
        1,
        'ACTIVE',
        1405,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140502,
        'Grimoire',
        '${simpleFormatting}',
        '${imageUrl}',
        140502,
        0,
        1,
        'ACTIVE',
        1405,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140601,
        'Warrior',
        '${simpleFormatting}',
        '${imageUrl}',
        140601,
        0,
        1,
        'ACTIVE',
        1406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140602,
        'Rouge',
        '${simpleFormatting}',
        '${imageUrl}',
        140602,
        0,
        1,
        'ACTIVE',
        1406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140603,
        'Mage',
        '${simpleFormatting}',
        '${imageUrl}',
        140603,
        0,
        1,
        'ACTIVE',
        1406,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140701,
        'Infinity',
        '${simpleFormatting}',
        '${imageUrl}',
        140701,
        0,
        1,
        'ACTIVE',
        1407,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        140901,
        'C-Shirt',
        '${simpleFormatting}',
        '${imageUrl}',
        140901,
        0,
        1,
        'ACTIVE',
        1409,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        141101,
        'ERC20 Owner',
        '${simpleFormatting}',
        '${imageUrl}',
        141101,
        0,
        1,
        'ACTIVE',
        1411,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        141201,
        'ERC1155 Owner',
        '${simpleFormatting}',
        '${imageUrl}',
        141101,
        0,
        1,
        'ACTIVE',
        1411,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        141301,
        'ERC1155 + ERC20 Owner',
        '${simpleFormatting}',
        '${imageUrl}',
        141101,
        0,
        1,
        'ACTIVE',
        1411,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        240101,
        'BEP',
        '${simpleFormatting}',
        '${imageUrl}',
        240101,
        0,
        1,
        'ACTIVE',
        2401,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
