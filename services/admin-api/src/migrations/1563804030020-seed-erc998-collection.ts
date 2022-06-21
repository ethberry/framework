import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedErc998Collection1563804030020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc998CollectionDropboxAddress = process.env.ERC998_DROPBOX_ADDR || wallet;
    const erc998CollectionAirdropAddress = process.env.ERC998_AIRDROP_ADDR || wallet;
    const erc998CollectionHeroAddress = process.env.ERC998_HERO_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1337;

    // 1 - 998.AIR, 2 - 998.DB, 3 - HERO, 4 - ITEM
    await queryRunner.query(`
      INSERT INTO ${ns}.erc998_collection (
        title,
        description,
        image_url,
        name,
        symbol,
        royalty,
        collection_status,
        collection_type,
        contract_template,
        address,
        base_token_uri,
        chain_id,
        created_at,
        updated_at
      ) VALUES  (
        'AIRDROP_ERC998',
        '${simpleFormatting}',
        '${imageUrl}',
        'AIRDROP_ERC998',
        'AIR998',
        100,
        'ACTIVE',
        'AIRDROP',
        'SIMPLE',
        '${erc998CollectionAirdropAddress}',
        '${baseTokenURI}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'DROPBOX_ERC998',
        '${simpleFormatting}',
        '${imageUrl}',
        'DROPBOX_ERC998',
        'DROP998',
        100,
        'ACTIVE',
        'DROPBOX',
        'SIMPLE',
        '${erc998CollectionDropboxAddress}',
        '${baseTokenURI}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'HEROES',
        '${simpleFormatting}',
        '${imageUrl}',
        'HEROES',
        'HERO998',
        100,
        'ACTIVE',
        'TOKEN',
        'RANDOM',
        '${erc998CollectionHeroAddress}',
        '${baseTokenURI}',
        '${chainId}',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc998_collection RESTART IDENTITY CASCADE;`);
  }
}
