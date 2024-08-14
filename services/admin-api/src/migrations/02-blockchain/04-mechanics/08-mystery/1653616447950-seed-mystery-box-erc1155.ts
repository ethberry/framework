import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedMysteryBoxErc1155At1653616447950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102085301
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
        102085301
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.mystery_box (
        title,
        description,
        image_url,
        content_id,
        template_id,
        mystery_box_status,
        created_at,
        updated_at
      ) VALUES (
        'Gold Mystery Box',
        '${simpleFormatting}',
        '${imageUrl}',
        102085301,
        1110501,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.mystery_box RESTART IDENTITY CASCADE;`);
  }
}
