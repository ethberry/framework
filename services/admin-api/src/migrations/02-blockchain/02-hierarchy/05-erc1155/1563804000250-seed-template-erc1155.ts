import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, imagePath, ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTemplateErc1155At1563804000250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        10100050101
      ), (
        10100050102
      ), (
        10100050103
      ), (
        10100050104
      ), (
        10100050105
      ), (
        10100050401
      ), (
        10100050402
      ), (
        10100050403
      ), (
        10100050501
      ), (
        20100050101
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
        1050101,
        'Gold',
        '${simpleFormatting}',
        '${imagePath}/gold.png',
        10100050101,
        0,
        '${WeiPerEther.toString()}',
        'ACTIVE',
        10501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1050102,
        'Wood',
        '${simpleFormatting}',
        '${imagePath}/wood.png',
        10100050102,
        0,
        '${WeiPerEther.toString()}',
        'ACTIVE',
        10501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1050103,
        'Iron ore',
        '${simpleFormatting}',
        '${imagePath}/iron.png',
        10100050103,
        0,
        '${WeiPerEther.toString()}',
        'ACTIVE',
        10501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1050104,
        'Planks',
        '${simpleFormatting}',
        '${imagePath}/plank.png',
        10100050104,
        0,
       '0',
        'ACTIVE',
        10501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1050105,
        'Iron ingot',
        '${simpleFormatting}',
        '${imagePath}/iron_ingot.png',
        10100050105,
        0,
        '0',
        'ACTIVE',
        10501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1050401,
        'Healing potion',
        '${simpleFormatting}',
        '${imagePath}/potion_health.png',
        10100050401,
        0,
        '0',
        'ACTIVE',
        10504,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1050402,
        'Mana potion',
        '${simpleFormatting}',
        '${imagePath}/potion_mana.png',
        10100050402,
        0,
        '0',
        'ACTIVE',
        10504,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1050403,
        'Antidote',
        '${simpleFormatting}',
        '${imagePath}/potion_antidot.png',
        10100050403,
        0,
        '0',
        'ACTIVE',
        10504,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1050501,
        'Lollypop',
        '${simpleFormatting}',
        '${imageUrl}',
        10100050501,
        0,
        '0',
        'ACTIVE',
        10504,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2050101,
        'BEP',
        '${simpleFormatting}',
        '${imageUrl}',
        20100050101,
        0,
        '0',
        'ACTIVE',
        20501,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
