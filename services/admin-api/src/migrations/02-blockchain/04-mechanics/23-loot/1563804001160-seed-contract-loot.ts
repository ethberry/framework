import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { baseTokenURI } from "@gemunion/contracts-constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { dummyContractAddrs, imageUrl, ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedContractLootAt1563804001160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    populate(
      process.env as any,
      {
        ERC721_LOOTBOX_SIMPLE_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC721_LOOTBOX_PAUSABLE_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC721_LOOTBOX_BLACKLIST_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC721_LOOTBOX_BLACKLIST_PAUSABLE_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const erc721ContractLootSimpleAddress = process.env.ERC721_LOOTBOX_SIMPLE_ADDR;
    const erc721ContractLootPausableAddress = process.env.ERC721_LOOTBOX_PAUSABLE_ADDR;
    const erc721ContractLootBlacklistAddress = process.env.ERC721_LOOTBOX_BLACKLIST_ADDR;
    const erc721ContractLootBlacklistPausableAddress = process.env.ERC721_LOOTBOX_BLACKLIST_PAUSABLE_ADDR;
    const chainId = process.env.CHAIN_ID_GEMUNION_BESU || testChainId;
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
        contract_module,
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        11201,
        '${erc721ContractLootSimpleAddress}',
        '${chainId}',
        'LOOT BOX (weapon)',
        '${simpleFormatting}',
        '${imageUrl}',
        'LOOT BOX',
        'MB721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{ALLOWANCE}',
        'LOOT',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11202,
        '${dummyContractAddrs[0]}',
        '${chainId}',
        'LOOT BOX (inactive)',
        '${simpleFormatting}',
        '${imageUrl}',
        'LOOT BOX',
        'MB-OFF721',
        100,
        '${baseTokenURI}',
        'INACTIVE',
        'ERC721',
        '{PAUSABLE,ALLOWANCE}',
        'LOOT',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11203,
        '${erc721ContractLootSimpleAddress}',
        '${chainId}',
        'LOOT BOX (new)',
        '${simpleFormatting}',
        '${imageUrl}',
        'LOOT BOX',
        'MB-NEW721',
        100,
        '${baseTokenURI}',
        'NEW',
        'ERC721',
        '{ALLOWANCE}',
        'LOOT',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11204,
        '${erc721ContractLootPausableAddress}',
        '${chainId}',
        'LOOT BOX (pausable)',
        '${simpleFormatting}',
        '${imageUrl}',
        'LOOT BOX',
        'MB-P721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{PAUSABLE,ALLOWANCE}',
        'LOOT',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11205,
        '${erc721ContractLootBlacklistAddress}',
        '${chainId}',
        'LOOT BOX (blacklist)',
        '${simpleFormatting}',
        '${imageUrl}',
        'LOOT BOX',
        'MB-BL721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{BLACKLIST,ALLOWANCE}',
        'LOOT',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11280,
        '${dummyContractAddrs[1]}',
        '${chainId}',
        'LOOT BOX',
        '${simpleFormatting}',
        '${imageUrl}',
        'LOOT BOX',
        'LB721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{ALLOWANCE}',
        'LOOT',
        '${fromBlock}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11206,
        '${erc721ContractLootBlacklistPausableAddress}',
        '${chainId}',
        'LOOT BOX (mixed)',
        '${simpleFormatting}',
        '${imageUrl}',
        'LOOT BOX',
        'MB-MIX721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{BLACKLIST,PAUSABLE,ALLOWANCE}',
        'LOOT',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        21201,
        '${dummyContractAddrs[2]}',
        56,
        'LOOT BOX (BEP)',
        '${simpleFormatting}',
        '${imageUrl}',
        'LOOT BOX',
        'MB-BEP721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{ALLOWANCE}',
        'LOOT',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
