import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedErc721Collection1563804021250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc721CollectionItemsAddress = process.env.ERC721_ITEM_ADDR || wallet;
    const erc721CollectionHeroAddress = process.env.ERC721_HERO_ADDR || wallet;
    const erc721CollectionSkillAddress = process.env.ERC721_SKILL_ADDR || wallet;
    const erc721CollectionDropboxAddress = process.env.ERC721_DROPBOX_ADDR || wallet;
    const erc721CollectionAirdropAddress = process.env.ERC721_AIRDROP_ADDR || wallet;

    // 1 - ITEMS, 2 - HERO, 3 - SKILLS, 4 - 721.DB, 5 - 721.AIR
    await queryRunner.query(`
      INSERT INTO ${ns}.erc721_collection (
        title,
        description,
        image_url,
        royalty,
        collection_type,
        address,
        permission_type,
        created_at,
        updated_at
      ) VALUES
      (
        'ITEMS',
        '${simpleFormatting}',
        '${imageUrl}',
        100,
        'TOKEN',
        '${erc721CollectionItemsAddress}',
        'ACCESS_CONTROL',
        '${currentDateTime}',
        '${currentDateTime}'
      ),
      (
        'HEROES',
        '${simpleFormatting}',
        '${imageUrl}',
        100,
        'TOKEN',
        '${erc721CollectionHeroAddress}',
        'ACCESS_CONTROL',
        '${currentDateTime}',
        '${currentDateTime}'
      ),
      (
        'SKILLS',
        '${simpleFormatting}',
        '${imageUrl}',
        100,
        'TOKEN',
        '${erc721CollectionSkillAddress}',
        'ACCESS_CONTROL',
        '${currentDateTime}',
        '${currentDateTime}'
      ),
        (
        'DROPBOX_ERC721',
        '${simpleFormatting}',
        '${imageUrl}',
        100,
        'DROPBOX',
        '${erc721CollectionDropboxAddress}',
        'ACCESS_CONTROL',
        '${currentDateTime}',
        '${currentDateTime}'
      ),
      (
        'AIRDROP_ERC721',
        '${simpleFormatting}',
        '${imageUrl}',
        100,
        'AIRDROP',
        '${erc721CollectionAirdropAddress}',
        'ACCESS_CONTROL',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc721_collection RESTART IDENTITY CASCADE;`);
  }
}
