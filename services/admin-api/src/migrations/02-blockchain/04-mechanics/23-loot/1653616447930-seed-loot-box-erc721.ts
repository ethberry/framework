import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedLootBoxErc721At1653616447930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102233101
      ), (
        102233102
      ), (
        102233802
      ), (
        202233101
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
        102233101
      ), (
        'ERC721',
        10306,
        1030602, -- Mace
        '1',
        102233101
      ), (
        'ERC721',
        10306,
        1030603, -- Axe
        '1',
        102233101
      ), (
        'ERC721',
        10306,
        1030601, -- Sword
        '1',
        102233102
      ), (
        'ERC721',
        10306,
        1030602, -- Mace
        '1',
        102233102
      ), (
        'ERC721',
        10306,
        1030603, -- Axe
        '1',
        102233102
      ), (
        'ERC721',
        10380,
        1038001, -- Trousers
        '1',
        102233802
      ), (
        'ERC721',
        10380,
        1038002, -- Pantaloons
        '1',
        102233802
      ), (
        'ERC721',
        10380,
        1038002, -- Bra
        '1',
        102233802
      ), (
        'ERC721',
        20301,
        2030101, -- bep
        '1',
        202233101
      ), (
        'ERC721',
        20301,
        2030101, -- bep
        '1',
        202233101
      ), (
        'ERC721',
        20301,
        2030101, -- bep
        '1',
        202233101
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.loot_box (
        title,
        description,
        image_url,
        item_id,
        template_id,
        loot_box_status,
        min,
        max,
        created_at,
        updated_at
      ) VALUES (
        'Weapon Loot Box',
        '${simpleFormatting}',
        '${imageUrl}',
        102233101,
        1120101,
        'ACTIVE',
        1,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Weapon Loot Box (inactive)',
        '${simpleFormatting}',
        '${imageUrl}',
        102233102,
        1120102,
        'INACTIVE',
        1,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Trousers Loot Box',
        '${simpleFormatting}',
        '${imageUrl}',
        102233802,
        1128001,
        'ACTIVE',
        1,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Loot Box (BEP)',
        '${simpleFormatting}',
        '${imageUrl}',
        202233101,
        2120101,
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
