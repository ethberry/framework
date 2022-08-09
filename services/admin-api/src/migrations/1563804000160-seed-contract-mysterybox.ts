import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { baseTokenURI, imageUrl, ns } from "@framework/constants";

export class SeedContractMysteryboxAt1563804000160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const mysteryboxAddress = process.env.MYSTERYBOX_ADDR || wallet;
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
        contract_features,
        contract_module,
        created_at,
        updated_at
      ) VALUES (
        41,
        '${mysteryboxAddress}',
        '${chainId}',
        'MYSTERYBOX',
        '${simpleFormatting}',
        '${imageUrl}',
        'MYSTERYBOX',
        'LOOT721',
        100,
        '${baseTokenURI}',
        'ACTIVE',
        'ERC721',
        '{MYSTERYBOX}',
        'MYSTERYBOX',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 41, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
