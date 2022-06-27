import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedUniContract1563804000150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc1155CollectionResourcesAddress = process.env.ERC1155_RESOURCES_ADDR || wallet;
    const erc1155CollectionPotionsAddress = process.env.ERC1155_POTIONS_ADDR || wallet;
    const erc1155CollectionShardsAddress = process.env.ERC1155_SHARDS_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1337;

    // 1 - 721.AIR, 2 - 721.DB, 3 - ITEMS, 4 - SKILLS, 5 - RUNES
    await queryRunner.query(`
      INSERT INTO ${ns}.uni_contract (
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
      ) VALUES  (
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
        'TOKEN',
        'ERC1155_SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
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
        'TOKEN',
        'ERC1155_SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
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
        'TOKEN',
        'ERC1155_SIMPLE',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.uni_contract RESTART IDENTITY CASCADE;`);
  }
}
