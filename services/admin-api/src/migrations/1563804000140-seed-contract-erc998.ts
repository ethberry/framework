import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedContractErc998At1563804000140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc998ContractSimpleAddress = process.env.ERC998_SIMPLE_ADDR || wallet;
    const erc998ContractInactiveAddress = process.env.ERC998_INACTIVE_ADDR || wallet;
    const erc998ContractNewAddress = process.env.ERC998_NEW_ADDR || wallet;
    const erc998ContractBlacklistAddress = process.env.ERC998_BLACKLIST_ADDR || wallet;
    const erc998ContractUpgradeableAddress = process.env.ERC998_UPGRADEABLE_ADDR || wallet;
    const erc998ContractRandomAddress = process.env.ERC998_RANDOM_ADDR || wallet;
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
        21,
        '${erc998ContractSimpleAddress}',
        '${chainId}',
        'SIMPLE',
        '${simpleFormatting}',
        '${imageUrl}',
        'SIMPLE',
        'SIMPLE998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        22,
        '${erc998ContractInactiveAddress}',
        '${chainId}',
        'INACTIVE',
        '${simpleFormatting}',
        '${imageUrl}',
        'INACTIVE',
        'INACTIVE998',
        100,
        '${baseTokenURI}',
        'INACTIVE',
        'ERC998',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        23,
        '${erc998ContractNewAddress}',
        '${chainId}',
        'NEW',
        '${simpleFormatting}',
        '${imageUrl}',
        'NEW',
        'NEW998',
        100,
        '${baseTokenURI}',
        'NEW',
        'ERC998',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        24,
        '${erc998ContractBlacklistAddress}',
        '${chainId}',
        'BLACKLIST',
        '${simpleFormatting}',
        '${imageUrl}',
        'BLACKLIST',
        'BLACKLIST998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        'BLACKLIST',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        25,
        '${erc998ContractUpgradeableAddress}',
        '${chainId}',
        'UPGRADEABLE',
        '${simpleFormatting}',
        '${imageUrl}',
        'UPGRADEABLE',
        'UPGRADEABLE998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        'UPGRADEABLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        26,
        '${erc998ContractRandomAddress}',
        '${chainId}',
        'HERO',
        '${simpleFormatting}',
        '${imageUrl}',
        'RANDOM',
        'RANDOM998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        'RANDOM',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 27, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
