import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedContractErc1155At1563804000150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc1155ContractSimpleAddress = process.env.ERC1155_SIMPLE_ADDR || wallet;
    const erc1155ContractInactiveAddress = process.env.ERC1155_INACTIVE_ADDR || wallet;
    const erc1155ContractNewAddress = process.env.ERC1155_NEW_ADDR || wallet;
    const erc1155ContractBlacklistAddress = process.env.ERC1155_BLACKLIST_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1337;

    // 31 - ITEMS, 32 - SKILLS, 33 - RUNES
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
        31,
        '${erc1155ContractSimpleAddress}',
        '${chainId}',
        'RESOURCES',
        '${simpleFormatting}',
        '${imageUrl}',
        '',
        '',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC1155',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        32,
        '${erc1155ContractInactiveAddress}',
        '${chainId}',
        'INACTIVE',
        '${simpleFormatting}',
        '${imageUrl}',
        '',
        '',
        100,
        '${baseTokenURI}',
        'INACTIVE',
        'ERC1155',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        33,
        '${erc1155ContractNewAddress}',
        '${chainId}',
        'NEW',
        '${simpleFormatting}',
        '${imageUrl}',
        '',
        '',
        100,
        '${baseTokenURI}',
        'NEW',
        'ERC1155',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        34,
        '${erc1155ContractBlacklistAddress}',
        '${chainId}',
        'POTIONS',
        '${simpleFormatting}',
        '${imageUrl}',
        '',
        '',
        100,
        '${baseTokenURI}',
        'NEW',
        'ERC1155',
        'BLACKLIST',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 34, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
