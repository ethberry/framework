import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedLootBoxMixedAt1653616447970 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102128401
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
        102128401
      ), (
        'ERC721',
        10306,
        1030601, -- Sword
        '1',
        102128401
      ), (
        'ERC998',
        10406,
        1040601, -- Warrior
        '1',
        102128401
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        102128401
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.loot_box (
        title,
        description,
        image_url,
        content_id,
        template_id,
        loot_box_status,
        min,
        max,
        created_at,
        updated_at
      ) VALUES (
        'Mixed Loot Box',
        '${simpleFormatting}',
        '${imageUrl}',
        102128401,
        1120601,
        'ACTIVE',
        1,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.loot_box RESTART IDENTITY CASCADE;`);
  }
}
