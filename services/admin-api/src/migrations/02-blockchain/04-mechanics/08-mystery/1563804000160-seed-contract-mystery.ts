import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedContractMysteryAt1563804000160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc721ContractMysterySimpleAddress = process.env.ERC721_MYSTERYBOX_SIMPLE_ADDR || wallet;
    const erc721ContractMysteryPausableAddress = process.env.ERC721_MYSTERYBOX_PAUSABLE_ADDR || wallet;
    const erc721ContractMysteryBlacklistAddress = process.env.ERC721_MYSTERYBOX_BLACKLIST_ADDR || wallet;
    const erc721ContractMysteryBlacklistPausableAddress =
      process.env.ERC721_MYSTERYBOX_BLACKLIST_PAUSABLE_ADDR || wallet;
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
        '{}',
        'MYSTERY',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11102,
        '${erc721ContractMysteryPausableAddress}',
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
        '{}',
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
        '{}',
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
        '{PAUSABLE}',
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
        '{BLACKLIST}',
        'MYSTERY',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11180,
        '${erc721ContractMysterySimpleAddress}',
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
        '{}',
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
        '{BLACKLIST,PAUSABLE}',
        'MYSTERY',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        21101,
        '${erc721ContractMysterySimpleAddress}',
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
        '{}',
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
