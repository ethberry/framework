import { MigrationInterface, QueryRunner } from "typeorm";

import { baseTokenURI, imageUrl, ns, testChainId } from "@framework/constants";
import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedContractMysteryAt1563804000160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc721ContractMysteryboxSimpleAddress = process.env.ERC721_MYSTERYBOX_SIMPLE_ADDR || wallet;
    const erc721ContractMysteryboxPausableAddress = process.env.ERC721_MYSTERYBOX_PAUSABLE_ADDR || wallet;
    const erc721ContractMysteryboxBlacklistAddress = process.env.ERC721_MYSTERYBOX_BLACKLIST_ADDR || wallet;
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
        1601,
        '${erc721ContractMysteryboxSimpleAddress}',
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
        1602,
        '${erc721ContractMysteryboxPausableAddress}',
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
        1603,
        '${erc721ContractMysteryboxSimpleAddress}',
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
        1604,
        '${erc721ContractMysteryboxPausableAddress}',
        '${chainId}',
        'MYSTERY BOX (hero)',
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
        1605,
        '${erc721ContractMysteryboxBlacklistAddress}',
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
        1606,
        '${erc721ContractMysteryboxSimpleAddress}',
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
