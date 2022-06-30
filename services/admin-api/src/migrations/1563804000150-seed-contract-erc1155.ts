import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedContractErc1155At1563804000150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc1155CollectionResourcesAddress = process.env.ERC1155_RESOURCES_ADDR || wallet;
    const erc1155CollectionPotionsAddress = process.env.ERC1155_POTIONS_ADDR || wallet;
    const erc1155CollectionShardsAddress = process.env.ERC1155_SHARDS_ADDR || wallet;
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
        contract_role,
        contract_template,
        created_at,
        updated_at
      ) VALUES (
        31,
        '${erc1155CollectionResourcesAddress}',
        '${chainId}',
        'RESOURCES',
        '${simpleFormatting}',
        '${imageUrl}',
        '',
        '',
        0,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC1155',
        'TOKEN',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        32,
        '${erc1155CollectionPotionsAddress}',
        '${chainId}',
        'POTIONS',
        '${simpleFormatting}',
        '${imageUrl}',
        '',
        '',
        0,
        '${baseTokenURI}',
        'INACTIVE',
        'ERC1155',
        'TOKEN',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        33,
        '${erc1155CollectionShardsAddress}',
        '${chainId}',
        'SHARDS',
        '${simpleFormatting}',
        '${imageUrl}',
        '',
        '',
        0,
        '${baseTokenURI}',
        'NEW',
        'ERC1155',
        'TOKEN',
        'SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 33, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
