import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedContractMysteryAt1563804000160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc721ContractMysteryboxSimpleAddress = process.env.ERC721_MYSTERY_SIMPLE_ADDR || wallet;
    const erc721ContractMysteryboxPausableAddress = process.env.ERC721_MYSTERY_PAUSABLE_ADDR || wallet;
    const erc721ContractMysteryboxBlacklistAddress = process.env.ERC721_MYSTERY_BLACKLIST_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1337;
    const fromBlock = process.env.STARTING_BLOCK || 0;

    // await queryRunner.query(`ALTER TYPE ${ns}.contract_module_enum ADD VALUE 'MYSTERY';`);

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
        601,
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
        602,
        '${erc721ContractMysteryboxSimpleAddress}',
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
        603,
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
        604,
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
        605,
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
        606,
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

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 605, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
