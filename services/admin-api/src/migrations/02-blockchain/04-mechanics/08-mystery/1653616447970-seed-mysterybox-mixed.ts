import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedMysteryBoxMixedAt1653616447970 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102120401
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
        102120401
      ), (
        'ERC721',
        10306,
        1030601, -- sword
        '1',
        102120401
      ), (
        'ERC998',
        10406,
        1040601, -- warrior
        '1',
        102120401
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        '1000',
        102120401
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.mysterybox (
        title,
        description,
        image_url,
        item_id,
        template_id,
        mystery_box_status,
        created_at,
        updated_at
      ) VALUES (
        'Mixed Mystery Box',
        '${simpleFormatting}',
        '${imageUrl}',
        102120401,
        1110601,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.mysterybox RESTART IDENTITY CASCADE;`);
  }
}
