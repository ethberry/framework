import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedErc721Collection1563804040020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc721CollectionDropboxAddress = process.env.ERC721_DROPBOX_ADDR || wallet;
    const erc721CollectionAirdropAddress = process.env.ERC721_AIRDROP_ADDR || wallet;
    const erc721CollectionItemsAddress = process.env.ERC721_ITEM_ADDR || wallet;
    const erc721CollectionSkillAddress = process.env.ERC721_SKILL_ADDR || wallet;
    const erc721CollectionRuneAddress = process.env.ERC721_RUNE_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1337;

    // 1 - 721.AIR, 2 - 721.DB, 3 - ITEMS, 4 - SKILLS, 5 - BUILDINGS
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
        'AIR721',
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
        'DROP721',
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
        'ITEM721',
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
        'SKILLS',
        '${simpleFormatting}',
        '${imageUrl}',
        'SKILLS',
        'SKIL721',
        100,
        'ACTIVE',
        'TOKEN',
        'GRADED',
        '${erc721CollectionSkillAddress}',
        '${baseTokenURI}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'RUNES',
        '${simpleFormatting}',
        '${imageUrl}',
        'RUNES',
        'RUNE721',
        100,
        'ACTIVE',
        'TOKEN',
        'RANDOM',
        '${erc721CollectionRuneAddress}',
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
