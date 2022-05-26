import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedErc721Collection1563804021250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc721CollectionItemsAddress = process.env.ERC721_ITEM_ADDR || wallet;
    const erc721CollectionHeroAddress = process.env.ERC721_HERO_ADDR || wallet;
    const erc721CollectionSkillAddress = process.env.ERC721_SKILL_ADDR || wallet;
    const erc721CollectionLandAddress = process.env.ERC721_LAND_ADDR || wallet;
    const erc721CollectionDropboxAddress = process.env.ERC721_DROPBOX_ADDR || wallet;
    const erc721CollectionAirdropAddress = process.env.ERC721_AIRDROP_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1;

    // 1 - 721.AIR, 2 - 721.DB, 3 - ITEMS, 4 - HERO, 5 - SKILLS, 6 - LAND
    await queryRunner.query(`
      INSERT INTO ${ns}.erc721_collection (
        title,
        description,
        image_url,
        name,
        symbol,
        royalty,
        collection_status,
        collection_type,
        contract_template,
        address,
        base_token_uri,
        chain_id,
        created_at,
        updated_at
      ) VALUES  (
        'AIRDROP_ERC721',
        '${simpleFormatting}',
        '${imageUrl}',
        'AIRDROP_ERC721',
        'GEM721',
        100,
        'ACTIVE',
        'AIRDROP',
        'SIMPLE',
        '${erc721CollectionAirdropAddress}',
        '${baseTokenURI}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'DROPBOX_ERC721',
        '${simpleFormatting}',
        '${imageUrl}',
        'DROPBOX_ERC721',
        'GEM721',
        100,
        'ACTIVE',
        'DROPBOX',
        'SIMPLE',
        '${erc721CollectionDropboxAddress}',
        '${baseTokenURI}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ITEMS',
        '${simpleFormatting}',
        '${imageUrl}',
        'ITEMS',
        'GEM721',
        100,
        'ACTIVE',
        'TOKEN',
        'RANDOM',
        '${erc721CollectionItemsAddress}',
        '${baseTokenURI}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'HEROES',
        '${simpleFormatting}',
        '${imageUrl}',
        'HEROES',
        'GEM721',
        100,
        'ACTIVE',
        'TOKEN',
        'RANDOM',
        '${erc721CollectionHeroAddress}',
        '${baseTokenURI}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'SKILLS',
        '${simpleFormatting}',
        '${imageUrl}',
        'SKILLS',
        'GEM721',
        100,
        'ACTIVE',
        'TOKEN',
        'GRADED',
        '${erc721CollectionSkillAddress}',
        '${baseTokenURI}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ),  (
        'LAND',
        '${simpleFormatting}',
        '${imageUrl}',
        'LAND',
        'GEM721',
        100,
        'ACTIVE',
        'TOKEN',
        'SIMPLE',
        '${erc721CollectionLandAddress}',
        '${baseTokenURI}',
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
