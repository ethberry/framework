import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedLootBoxErc1155At1653616447950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102124301
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
        'ERC1155',
        10501,
        1050101, -- Gold
        1000,
        102124301
      ), (
        'ERC1155',
        10501,
        1050102, -- Wood
        '1000',
        102124301
      ), (
        'ERC1155',
        10501,
        1050103, -- Iron ore
        '1000',
        102124301
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
        'Resource Loot Box',
        '${simpleFormatting}',
        '${imageUrl}',
        102124301,
        1120501,
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
