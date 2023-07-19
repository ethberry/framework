import { MigrationInterface, QueryRunner } from "typeorm";

import { imageUrl, ns } from "@framework/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedMysteryBoxErc721At1653616447930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102120101
      ), (
        102120102
      ), (
        102128002
      ), (
        202120101
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
        1030601, -- Sword
        '1',
        102120101
      ), (
        'ERC721',
        10306,
        1030601, -- Sword
        '1',
        102120102
      ), (
        'ERC721',
        10380,
        1038001, -- Trousers
        '1',
        102128002
      ), (
        'ERC721',
        20301,
        2030101, -- bep
        '1',
        202120101
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
        'Sword Mystery Box',
        '${simpleFormatting}',
        '${imageUrl}',
        102120101,
        1110101,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Sword Mystery Box (inactive)',
        '${simpleFormatting}',
        '${imageUrl}',
        102120102,
        1110102,
        'INACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Trousers Loot Box',
        '${simpleFormatting}',
        '${imageUrl}',
        102128002,
        1118001,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Mystery Box (BEP)',
        '${simpleFormatting}',
        '${imageUrl}',
        202120101,
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
