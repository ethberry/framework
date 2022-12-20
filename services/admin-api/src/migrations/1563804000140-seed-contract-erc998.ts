import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns, testChainId } from "@framework/constants";

export class SeedContractErc998At1563804000140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc998ContractSimpleAddress = process.env.ERC998_SIMPLE_ADDR || wallet;
    const erc998ContractInactiveAddress = process.env.ERC998_INACTIVE_ADDR || wallet;
    const erc998ContractNewAddress = process.env.ERC998_NEW_ADDR || wallet;
    const erc998ContractBlacklistAddress = process.env.ERC998_BLACKLIST_ADDR || wallet;
    const erc998ContractUpgradeableAddress = process.env.ERC998_UPGRADEABLE_ADDR || wallet;
    const erc998ContractRandomAddress = process.env.ERC998_RANDOM_ADDR || wallet;
    const erc998ContractGenesAddress = process.env.ERC998_GENES_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || testChainId;
    const fromBlock = process.env.STARTING_BLOCK || 0;

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
        from_block,
        created_at,
        updated_at
      ) VALUES (
        1401,
        '${erc998ContractSimpleAddress}',
        '${chainId}',
        'ERC998 (simple)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC998 SIMPLE',
        'GEM998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE}',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1402,
        '${erc998ContractInactiveAddress}',
        '${chainId}',
        'ERC998 (inactive)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC998 INACTIVE',
        'OFF998',
        100,
        '${baseTokenURI}',
        'INACTIVE',
        'ERC998',
        '{ALLOWANCE}',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1403,
        '${erc998ContractNewAddress}',
        '${chainId}',
        'ERC998 (new)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC998 NEW',
        'NEW998',
        100,
        '${baseTokenURI}',
        'NEW',
        'ERC998',
        '{ALLOWANCE}',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1404,
        '${erc998ContractBlacklistAddress}',
        '${chainId}',
        'ERC998 (blacklist)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC998 BLACKLIST',
        'BL998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE,BLACKLIST}',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1405,
        '${erc998ContractUpgradeableAddress}',
        '${chainId}',
        'Spell book (upgradeable)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC998 UPGRADEABLE',
        'LVL998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE,UPGRADEABLE}',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1406,
        '${erc998ContractRandomAddress}',
        '${chainId}',
        'HERO (random)',
        '${simpleFormatting}',
        '${imageUrl}',
        'ERC998 RANDOM',
        'RNG998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE,UPGRADEABLE,RANDOM}',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1407,
        '${erc998ContractGenesAddress}',
        '${chainId}',
        'AXIE (genes)',
        '${simpleFormatting}',
        '${imageUrl}',
        'GENES',
        'DNA998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE,GENES}',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2401,
        '${wallet}',
        56,
        'BEP (binance)',
        '${simpleFormatting}',
        '${imageUrl}',
        'BEP',
        'BEP998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        '{ALLOWANCE}',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 2401, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
