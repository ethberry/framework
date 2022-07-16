import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedContractErc721At1563804000130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc721CollectionItemsAddress = process.env.ERC721_ITEM_ADDR || wallet;
    const erc721CollectionSkillAddress = process.env.ERC721_SKILL_ADDR || wallet;
    const erc721CollectionRuneAddress = process.env.ERC721_RUNE_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1337;

    // 11 - ITEMS, 12 - SKILLS, 13 - RUNES
    await queryRunner.query(`
      INSERT INTO ${ns}.contract (
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
        contract_template,
        created_at,
        updated_at
      ) VALUES (
        11,
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
        'RANDOM',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        12,
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
        'GRADED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13,
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
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 15, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
