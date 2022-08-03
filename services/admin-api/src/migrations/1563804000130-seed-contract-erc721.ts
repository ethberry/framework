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
        contract_template,
        created_at,
        updated_at
      ) VALUES (
        11,
        '${erc721ContractSimpleAddress}',
        '${chainId}',
        'RUNES (SIMPLE)',
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
      ), (
        12,
        '${erc721ContractInactiveAddress}',
        '${chainId}',
        'INACTIVE',
        '${simpleFormatting}',
        '${imageUrl}',
        'INACTIVE',
        'INACTIVE721',
        100,
        '${baseTokenURI}',
        'INACTIVE',
        'ERC721',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        13,
        '${erc721ContractNewAddress}',
        '${chainId}',
        'NEW',
        '${simpleFormatting}',
        '${imageUrl}',
        'NEW',
        'NEW721',
        100,
        '${baseTokenURI}',
        'NEW',
        'ERC721',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        14,
        '${erc721ContractBlacklistAddress}',
        '${chainId}',
        'BLACKLIST',
        '${simpleFormatting}',
        '${imageUrl}',
        'BLACKLIST',
        'BLACKLIST721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        'BLACKLIST',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15,
        '${erc721ContractRandomAddress}',
        '${chainId}',
        'ARMOUR (UPGRADEABLE)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ARMOUR',
        'ARMOUR721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        'UPGRADEABLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        16,
        '${erc721ContractUpgradeableAddress}',
        '${chainId}',
        'WEAPON (RANDOM)',
        '${simpleFormatting}',
        '${imageUrl}',
        'WEAPON',
        'WEAPON721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        'RANDOM',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 16, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
