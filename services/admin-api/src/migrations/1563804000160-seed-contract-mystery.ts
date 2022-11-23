import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedContractMysteryAt1563804000160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc721ContractMysteryboxSimpleAddress = process.env.ERC721_MYSTERYBOX_SIMPLE_ADDR || wallet;
    const erc721ContractMysteryboxPausableAddress = process.env.ERC721_MYSTERYBOX_PAUSABLE_ADDR || wallet;
    const erc721ContractMysteryboxBlacklistAddress = process.env.ERC721_MYSTERYBOX_BLACKLIST_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 13378;
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
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 1606, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
