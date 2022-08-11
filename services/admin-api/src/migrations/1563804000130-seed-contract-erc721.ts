import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedContractErc721At1563804000130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc721ContractSimpleAddress = process.env.ERC721_SIMPLE_ADDR || wallet;
    const erc721ContractInactiveAddress = process.env.ERC721_INACTIVE_ADDR || wallet;
    const erc721ContractNewAddress = process.env.ERC721_NEW_ADDR || wallet;
    const erc721ContractBlacklistAddress = process.env.ERC721_BLACKLIST_ADDR || wallet;
    const erc721ContractUpgradeableAddress = process.env.ERC721_UPGRADEABLE_ADDR || wallet;
    const erc721ContractRandomAddress = process.env.ERC721_RANDOM_ADDR || wallet;
    const erc721ContractSoluboundAddress = process.env.ERC721_SOULBOUND_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1337;

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
        contract_features,
        created_at,
        updated_at
      ) VALUES (
        31,
        '${erc721ContractSimpleAddress}',
        '${chainId}',
        'RUNE (simple)',
        '${simpleFormatting}',
        '${imageUrl}',
        'RUNE',
        'GEM721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        32,
        '${erc721ContractInactiveAddress}',
        '${chainId}',
        'ERC721 (inactive)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC721 INACTIVE',
        'OFF721',
        100,
        '${baseTokenURI}',
        'INACTIVE',
        'ERC721',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        33,
        '${erc721ContractNewAddress}',
        '${chainId}',
        'ERC721 (new)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC721 NEW',
        'NEW721',
        100,
        '${baseTokenURI}',
        'NEW',
        'ERC721',
        '{}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        34,
        '${erc721ContractBlacklistAddress}',
        '${chainId}',
        'ERC721 (blacklist)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC721 BLACKLIST',
        'BL721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{BLACKLIST}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        35,
        '${erc721ContractUpgradeableAddress}',
        '${chainId}',
        'ARMOUR (upgradeable)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ARMOUR',
        'LVL721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{UPGRADEABLE}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        36,
        '${erc721ContractRandomAddress}',
        '${chainId}',
        'WEAPON (random)',
        '${simpleFormatting}',
        '${imageUrl}',
        'WEAPON',
        'RNG721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{UPGRADEABLE,RANDOM}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        37,
        '${erc721ContractSoluboundAddress}',
        '${chainId}',
        'MEDAL (soulbound)',
        '${simpleFormatting}',
        '${imageUrl}',
        'SOULBOUND',
        'SB721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{SOULBOUND}',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 37, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
