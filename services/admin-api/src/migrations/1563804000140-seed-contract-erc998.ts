import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedContractErc998At1563804000140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc998CollectionDropboxAddress = process.env.DROPBOX_ADDR || wallet;
    const erc998CollectionAirdropAddress = process.env.ERC998_AIRDROP_ADDR || wallet;
    const erc998CollectionHeroAddress = process.env.ERC998_HERO_ADDR || wallet;

    const chainId = process.env.CHAIN_ID || 1337;

    // 23 - HERO
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
      ) VALUES  (
        21,
        '${erc998CollectionAirdropAddress}',
        '${chainId}',
        'AIRDROP_ERC998',
        '${simpleFormatting}',
        '${imageUrl}',
        'AIRDROP_ERC998',
        'AIR998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        'AIRDROP',
        'UNKNOWN',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        22,
        '${erc998CollectionDropboxAddress}',
        '${chainId}',
        'DROPBOX_ERC998',
        '${simpleFormatting}',
        '${imageUrl}',
        'DROPBOX_ERC998',
        'DROP998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        'DROPBOX',
        'UNKNOWN',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        23,
        '${erc998CollectionHeroAddress}',
        '${chainId}',
        'HEROES',
        '${simpleFormatting}',
        '${imageUrl}',
        'HEROES',
        'HERO998',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC998',
        'TOKEN',
        'RANDOM',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 23, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
