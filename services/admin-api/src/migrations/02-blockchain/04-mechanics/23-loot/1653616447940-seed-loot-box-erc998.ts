import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@ethberry/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@ethberry/constants";

export class SeedLootBoxErc998At1653616447940 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102124201
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
        'ERC998',
        10406,
        1040601, -- Warrior
        '1',
        102124201
      ), (
        'ERC998',
        10406,
        1040602, -- rouge
        '1',
        102124201
      ), (
        'ERC998',
        10406,
        1040603, -- mage
        '1',
        102124201
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
        'Character Loot Box',
        '${simpleFormatting}',
        '${imageUrl}',
        102124201,
        1120401,
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
