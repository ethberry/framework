import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedMysteryboxErc721At1653616447930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        33101
      ), (
        33201
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
        'ERC721',
        1306,
        130601, -- sword
        '1',
        33101
      ), (
        'ERC721',
        1306,
        130601, -- sword
        '1',
        33201
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.mysterybox (
        title,
        description,
        image_url,
        item_id,
        template_id,
        mysterybox_status,
        created_at,
        updated_at
      ) VALUES (
        'Sword Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        33101,
        160101,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Inactive Mysterybox',
        '${simpleFormatting}',
        '${imageUrl}',
        33201,
        160102,
        'INACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.mysterybox RESTART IDENTITY CASCADE;`);
  }
}
