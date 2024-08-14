import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedMysteryBoxErc721At1653616447930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102083101
      ), (
        102083102
      ), (
        102083802
      ), (
        202083101
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
        102083101
      ), (
        'ERC721',
        10306,
        1030601, -- Sword
        '1',
        102083102
      ), (
        'ERC721',
        10380,
        1038001, -- Trousers
        '1',
        102083802
      ), (
        'ERC721',
        20301,
        2030101, -- bep
        '1',
        202083101
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
        'Sword Mystery Box',
        '${simpleFormatting}',
        '${imageUrl}',
        102083101,
        1110101,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Sword Mystery Box (inactive)',
        '${simpleFormatting}',
        '${imageUrl}',
        102083102,
        1110102,
        'INACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Trousers Mystery Box',
        '${simpleFormatting}',
        '${imageUrl}',
        102083802,
        1118001,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Mystery Box (BEP)',
        '${simpleFormatting}',
        '${imageUrl}',
        202083101,
        2110101,
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
