import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, imagePath } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTemplateLootAt1563804000260 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102230101
      ), (
        102230102
      ), (
        102230401
      ), (
        102230501
      ), (
        102230601
      ), (
        102230801
      ), (
        202230101
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
        1120101,
        'Sword Lootbox',
        '${simpleFormatting}',
        '${imagePath}/lootbox.png',
        102230101,
        0,
        4,
        'ACTIVE',
        11201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1120102,
        'Sword Lootbox Inactive',
        '${simpleFormatting}',
        '${imagePath}/lootbox.png',
        102230102,
        0,
        1,
        'INACTIVE',
        11201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1120401,
        'Warrior Lootbox',
        '${simpleFormatting}',
        '${imagePath}/lootbox.png',
        102230401,
        0,
        1,
        'ACTIVE',
        11204,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1120501,
        'Gold Lootbox',
        '${simpleFormatting}',
        '${imagePath}/lootbox.png',
        102230501,
        0,
        1,
        'ACTIVE',
        11205,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1120601,
        'Mixed Lootbox',
        '${simpleFormatting}',
        '${imagePath}/lootbox.png',
        102230601,
        0,
        1,
        'ACTIVE',
        11206,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1128001,
        'Loot box',
        '${simpleFormatting}',
        '${imagePath}/lootbox.png',
        102230801,
        0,
        1,
        'ACTIVE',
        11280,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2120101,
        'Lootbox (BEP)',
        '${simpleFormatting}',
        '${imagePath}/lootbox.png',
        202230101,
        0,
        1,
        'ACTIVE',
        21201,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
