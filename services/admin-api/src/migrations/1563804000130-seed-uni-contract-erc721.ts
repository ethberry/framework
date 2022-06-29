import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedUniContractErc721At1563804000130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc721CollectionDropboxAddress = process.env.ERC721_DROPBOX_ADDR || wallet;
    const erc721CollectionAirdropAddress = process.env.ERC721_AIRDROP_ADDR || wallet;
    const erc721CollectionItemsAddress = process.env.ERC721_ITEM_ADDR || wallet;
    const erc721CollectionSkillAddress = process.env.ERC721_SKILL_ADDR || wallet;
    const erc721CollectionRuneAddress = process.env.ERC721_RUNE_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1337;

    // 1 - 721.AIR, 2 - 721.DB, 3 - ITEMS, 4 - SKILLS, 5 - RUNES
    await queryRunner.query(`
      INSERT INTO ${ns}.uni_contract (
        id,
        address,
        chain_id,
        title,
        description,
        image_url,
        name,
        symbol,
        royalty,
        base_token_uri,
        contract_status,
        contract_type,
        contract_role,
        contract_template,
        created_at,
        updated_at
      ) VALUES  (
        11,
        '${erc721CollectionAirdropAddress}',
        '${chainId}',
        'AIRDROP_ERC721',
        '${simpleFormatting}',
        '${imageUrl}',
        'AIRDROP_ERC721',
        'AIR721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        'AIRDROP',
        'UNKNOWN',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        12,
        '${erc721CollectionDropboxAddress}',
        '${chainId}',
        'DROPBOX_ERC721',
        '${simpleFormatting}',
        '${imageUrl}',
        'DROPBOX_ERC721',
        'DROP721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        'DROPBOX',
        'UNKNOWN',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13,
        '${erc721CollectionItemsAddress}',
        '${chainId}',
        'ITEMS',
        '${simpleFormatting}',
        '${imageUrl}',
        'ITEMS',
        'ITEM721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        'TOKEN',
        'RANDOM',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        14,
        '${erc721CollectionSkillAddress}',
        '${chainId}',
        'SKILLS',
        '${simpleFormatting}',
        '${imageUrl}',
        'SKILLS',
        'SKIL721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        'TOKEN',
        'GRADED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15,
        '${erc721CollectionRuneAddress}',
        '${chainId}',
        'RUNES',
        '${simpleFormatting}',
        '${imageUrl}',
        'RUNES',
        'RUNE721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        'TOKEN',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);

    await queryRunner.query(`SELECT setval('${ns}.uni_contract_id_seq', 15, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.uni_contract RESTART IDENTITY CASCADE;`);
  }
}
