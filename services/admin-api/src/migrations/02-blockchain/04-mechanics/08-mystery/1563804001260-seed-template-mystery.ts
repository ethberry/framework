import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@ethberry/draft-js-utils";
import { ns, imagePath } from "@framework/constants";
import { NodeEnv } from "@ethberry/constants";

export class SeedTemplateMysteryAt1563804001260 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
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
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102080101
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102080102
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102080401
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102080501
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102080601
      ), (
        'ERC20',
        10280,
        1028001, -- Warp Credits
        '${WeiPerEther.toString()}',
        102080801
      ), (
        'ERC20',
        10280,
        1028001, -- Warp Credits
        '${WeiPerEther.toString()}',
        102080801
      ), (
        'ERC20',
        20201,
        2020101, -- BEP Credits
        '${WeiPerEther.toString()}',
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
