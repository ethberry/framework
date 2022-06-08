import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedErc1155Collection1641526822360 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc1155CollectionResourcesAddress = process.env.ERC1155_RESOURCES_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1337;

    await queryRunner.query(`
      INSERT INTO ${ns}.erc1155_collection (
        title,
        description,
        image_url,
        address,
        base_token_uri,
        collection_status,
        contract_template,
        chain_id,
        created_at,
        updated_at
      ) VALUES (
        'RESOURCES',
        '${simpleFormatting}',
        '${imageUrl}',
        '${erc1155CollectionResourcesAddress}',
        '${baseTokenURI}',
        'ACTIVE',
        'SIMPLE',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc1155_collection RESTART IDENTITY CASCADE;`);
  }
}
