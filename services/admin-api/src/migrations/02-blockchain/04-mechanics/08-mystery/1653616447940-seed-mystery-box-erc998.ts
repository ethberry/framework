import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedMysteryBoxErc998At1653616447940 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102084201
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
        102084201
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
        'Warrior Mystery Box',
        '${simpleFormatting}',
        '${imageUrl}',
        102084201,
        1110401,
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
