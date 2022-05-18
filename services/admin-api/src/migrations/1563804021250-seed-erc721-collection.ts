import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseUri, imageUrl, ns } from "@framework/constants";

export class SeedErc721Collection1563804021250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc721CollectionItemsAddress = process.env.ERC721_ITEM_ADDR || wallet;
    const erc721CollectionHeroAddress = process.env.ERC721_HERO_ADDR || wallet;
    const erc721CollectionSkillAddress = process.env.ERC721_SKILL_ADDR || wallet;
    const erc721CollectionDropboxAddress = process.env.ERC721_DROPBOX_ADDR || wallet;
    const erc721CollectionAirdropAddress = process.env.ERC721_AIRDROP_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1;

    // 1 - 721.AIR, 2 - 721.DB, 3 - ITEMS, 4 - HERO, 5 - SKILLS, 6 - LAND
    await queryRunner.query(`
      INSERT INTO ${ns}.erc721_collection (
        title,
        description,
        image_url,
        symbol,
        royalty,
        collection_type,
        address,
        base_uri,
        chain_id,
        created_at,
        updated_at
      ) VALUES  (
        'AIRDROP_ERC721',
        '${simpleFormatting}',
        '${imageUrl}',
        'GEM721',
        100,
        'AIRDROP',
        '${erc721CollectionAirdropAddress}',
        'NULL',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'DROPBOX_ERC721',
        '${simpleFormatting}',
        '${imageUrl}',
        'GEM721',
        100,
        'DROPBOX',
        '${erc721CollectionDropboxAddress}',
        'NULL',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ITEMS',
        '${simpleFormatting}',
        '${imageUrl}',
        'GEM721',
        100,
        'TOKEN',
        '${erc721CollectionItemsAddress}',
        '${baseUri}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'HEROES',
        '${simpleFormatting}',
        '${imageUrl}',
        'GEM721',
        100,
        'TOKEN',
        '${erc721CollectionHeroAddress}',
        '${baseUri}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'SKILLS',
        '${simpleFormatting}',
        '${imageUrl}',
        'GEM721',
        100,
        'TOKEN',
        '${erc721CollectionSkillAddress}',
        '${baseUri}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ),  (
        'LAND',
        '${simpleFormatting}',
        '${imageUrl}',
        'GEM721',
        100,
        'TOKEN',
        '${erc721CollectionSkillAddress}',
        '${baseUri}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc721_collection RESTART IDENTITY CASCADE;`);
  }
}
