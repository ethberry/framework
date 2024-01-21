import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

import testErc20Tokens from "@framework/core-contracts/tasks/test-data/erc20tokens.json";

export class SeedTestDataAt9763804000120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;
    const fromBlock = process.env.STARTING_BLOCK || 0;

    const entries = Object.entries(testErc20Tokens);

    let indx = 1;
    for (const [key, val] of entries) {
      console.info(`processing ${indx} of ${entries.length}`);
      indx++;
      // ERC20
      await queryRunner.query(`
      INSERT INTO ${ns}.contract (
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
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        '${val.address}',
        '${chainId}',
        '${key}',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fspace_credit.png?alt=media&token=b940fa35-78bd-4534-b015-6ee8e290506e',
        '${key}',
        '${key}',
        ${val.decimals},
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
      // ERC721
      await queryRunner.query(`
      INSERT INTO ${ns}.contract (
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
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        '${val.address}',
        '${chainId}',
        '${key}',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fspace_credit.png?alt=media&token=b940fa35-78bd-4534-b015-6ee8e290506e',
        '${key}',
        '${key}',
        ${val.decimals},
        0,
        '',
        'ACTIVE',
        'ERC721',
        '{}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
      // ERC998
      await queryRunner.query(`
      INSERT INTO ${ns}.contract (
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
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        '${val.address}',
        '${chainId}',
        '${key}',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fspace_credit.png?alt=media&token=b940fa35-78bd-4534-b015-6ee8e290506e',
        '${key}',
        '${key}',
        ${val.decimals},
        0,
        '',
        'ACTIVE',
        'ERC998',
        '{}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
      // ERC1155
      await queryRunner.query(`
      INSERT INTO ${ns}.contract (
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
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        '${val.address}',
        '${chainId}',
        '${key}',
        '${simpleFormatting}',
        'https://firebasestorage.googleapis.com/v0/b/gemunion-firebase.appspot.com/o/DO_NOT_REMOVE%2Fspace_credit.png?alt=media&token=b940fa35-78bd-4534-b015-6ee8e290506e',
        '${key}',
        '${key}',
        ${val.decimals},
        0,
        '',
        'ACTIVE',
        'ERC1155',
        '{}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
    }

    for (let i = 2; i < 100000; i++) {
      await queryRunner.query(`
      INSERT INTO ${ns}.chain_link_subscriptions (
        merchant_id,
        chain_id,
        vrf_sub_id,
        created_at,
        updated_at
      ) VALUES (
        1,
        '${chainId}',
        '${i}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
