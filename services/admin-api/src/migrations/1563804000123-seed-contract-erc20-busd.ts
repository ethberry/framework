import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns, testChainId } from "@framework/constants";

export class SeedContractErc20BUSDAt1563804000123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const fromBlock = process.env.STARTING_BLOCK || 0;
    const chainId = process.env.CHAIN_ID || testChainId;

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
        decimals,
        royalty,
        base_token_uri,
        contract_status,
        contract_type,
        contract_features,
        from_block,
        created_at,
        updated_at
      ) VALUES (
        2207,
        '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        56,
        'BUSD',
        '${simpleFormatting}',
        '${imageUrl}',
        'Biance USD',
        'BUSD',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4207,
        '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        '${chainId}',
        'BUSD',
        '${simpleFormatting}',
        '${imageUrl}',
        'Biance USD',
        'BUSD',
        18,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    // await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 2207, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
