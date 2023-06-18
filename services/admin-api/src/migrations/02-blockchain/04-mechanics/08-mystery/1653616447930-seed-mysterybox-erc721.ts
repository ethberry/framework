import { MigrationInterface, QueryRunner } from "typeorm";

import { imageUrl, ns } from "@framework/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

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
      ), (
        33301
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
        10306,
        1030601, -- sword
        '1',
        33101
      ), (
        'ERC721',
        10306,
        1030601, -- sword
        '1',
        33201
      ), (
        'ERC721',
        20301,
        2030101, -- bep
        '1',
        33301
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
        1110101,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Sword Mysterybox (inactive)',
        '${simpleFormatting}',
        '${imageUrl}',
        33201,
        1110102,
        'INACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Mysterybox (BEP)',
        '${simpleFormatting}',
        '${imageUrl}',
        33301,
        2110101,
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
