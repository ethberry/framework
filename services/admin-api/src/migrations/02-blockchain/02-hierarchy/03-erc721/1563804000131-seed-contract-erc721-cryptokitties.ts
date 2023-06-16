import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedContractErc721CryptoKittiesAt1563804000131 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
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
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        1315,
        '0x06012c8cf97bead5deae237070f9587f8e7a266d',
        1,
        'CryptoKitties (external)',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fcrypto_kitties.png?alt=media&token=df69f93c-8892-4456-92f8-34dc3703b64b',
        'CK',
        'CK',
        0,
        'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/{tokenId}.png',
        'ACTIVE',
        'ERC721',
        '{EXTERNAL}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
