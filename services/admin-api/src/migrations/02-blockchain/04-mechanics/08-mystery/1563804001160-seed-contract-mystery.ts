import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { baseTokenURI } from "@ethberry/contracts-constants";
import { simpleFormatting } from "@ethberry/draft-js-utils";
import { dummyContractAddrs, imageUrl, ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@ethberry/constants";

export class SeedContractMysteryAt1563804001160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        ERC721_MYSTERYBOX_SIMPLE_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC721_MYSTERYBOX_PAUSABLE_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC721_MYSTERYBOX_BLACKLIST_ADDR: Wallet.createRandom().address.toLowerCase(),
        ERC721_MYSTERYBOX_BLACKLIST_PAUSABLE_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const erc721ContractMysterySimpleAddress = process.env.ERC721_MYSTERYBOX_SIMPLE_ADDR;
    const erc721ContractMysteryPausableAddress = process.env.ERC721_MYSTERYBOX_PAUSABLE_ADDR;
    const erc721ContractMysteryBlacklistAddress = process.env.ERC721_MYSTERYBOX_BLACKLIST_ADDR;
    const erc721ContractMysteryBlacklistPausableAddress = process.env.ERC721_MYSTERYBOX_BLACKLIST_PAUSABLE_ADDR;
    const chainId = process.env.CHAIN_ID_ETHBERRY || process.env.CHAIN_ID_ETHBERRY_BESU || testChainId;
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
        11101,
        '${erc721ContractMysterySimpleAddress}',
        '${chainId}',
        'MYSTERY BOX (weapon)',
        '${simpleFormatting}',
        '${imageUrl}',
        'MYSTERY BOX',
        'MB721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{ALLOWANCE}',
        'MYSTERY',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11102,
        '${dummyContractAddrs[0]}',
        '${chainId}',
        'MYSTERY BOX (inactive)',
        '${simpleFormatting}',
        '${imageUrl}',
        'MYSTERY BOX',
        'MB-OFF721',
        100,
        '${baseTokenURI}',
        'INACTIVE',
        'ERC721',
        '{PAUSABLE,ALLOWANCE}',
        'MYSTERY',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11103,
        '${erc721ContractMysterySimpleAddress}',
        '${chainId}',
        'MYSTERY BOX (new)',
        '${simpleFormatting}',
        '${imageUrl}',
        'MYSTERY BOX',
        'MB-NEW721',
        100,
        '${baseTokenURI}',
        'NEW',
        'ERC721',
        '{ALLOWANCE}',
        'MYSTERY',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11104,
        '${erc721ContractMysteryPausableAddress}',
        '${chainId}',
        'MYSTERY BOX (pausable)',
        '${simpleFormatting}',
        '${imageUrl}',
        'MYSTERY BOX',
        'MB-P721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{PAUSABLE,ALLOWANCE}',
        'MYSTERY',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11105,
        '${erc721ContractMysteryBlacklistAddress}',
        '${chainId}',
        'MYSTERY BOX (blacklist)',
        '${simpleFormatting}',
        '${imageUrl}',
        'MYSTERY BOX',
        'MB-BL721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{BLACKLIST,ALLOWANCE}',
        'MYSTERY',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11180,
        '${dummyContractAddrs[1]}',
        '${chainId}',
        'MYSTERY BOX',
        '${simpleFormatting}',
        '${imageUrl}',
        'MYSTERY BOX',
        'LB721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{ALLOWANCE}',
        'MYSTERY',
        '${fromBlock}',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11106,
        '${erc721ContractMysteryBlacklistPausableAddress}',
        '${chainId}',
        'MYSTERY BOX (mixed)',
        '${simpleFormatting}',
        '${imageUrl}',
        'MYSTERY BOX',
        'MB-MIX721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{BLACKLIST,PAUSABLE,ALLOWANCE}',
        'MYSTERY',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        21101,
        '${dummyContractAddrs[2]}',
        56,
        'MYSTERY BOX (BEP)',
        '${simpleFormatting}',
        '${imageUrl}',
        'MYSTERY BOX',
        'MB-BEP721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{ALLOWANCE}',
        'MYSTERY',
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
