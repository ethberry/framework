import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, imagePath } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTemplateMysteryAt1563804000260 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102080101
      ), (
        102080102
      ), (
        102080401
      ), (
        102080501
      ), (
        102080601
      ), (
        102080801
      ), (
        201080101
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
        1110101,
        'Sword Mystery Box',
        '${simpleFormatting}',
        '${imagePath}/mysterybox.png',
        102080101,
        0,
        4,
        'ACTIVE',
        11101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1110102,
        'Sword Mystery Box Inactive',
        '${simpleFormatting}',
        '${imagePath}/mysterybox.png',
        102080102,
        0,
        1,
        'INACTIVE',
        11101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1110401,
        'Warrior Mystery Box',
        '${simpleFormatting}',
        '${imagePath}/mysterybox.png',
        102080401,
        0,
        1,
        'ACTIVE',
        11104,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1110501,
        'Gold Mystery Box',
        '${simpleFormatting}',
        '${imagePath}/mysterybox.png',
        102080501,
        0,
        1,
        'ACTIVE',
        11105,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1110601,
        'Mixed Mystery Box',
        '${simpleFormatting}',
        '${imagePath}/mysterybox.png',
        102080601,
        0,
        1,
        'ACTIVE',
        11106,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1118001,
        'Mystery Box',
        '${simpleFormatting}',
        '${imagePath}/mysterybox.png',
        102080801,
        0,
        1,
        'ACTIVE',
        11180,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2110101,
        'Mystery Box (BEP)',
        '${simpleFormatting}',
        '${imagePath}/mysterybox.png',
        201080101,
        0,
        1,
        'ACTIVE',
        21101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.template RESTART IDENTITY CASCADE;`);
  }
}
