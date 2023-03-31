import { MigrationInterface, QueryRunner } from "typeorm";

import { imageUrl, ns, testChainId } from "@framework/constants";
import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedContractErc20USDTAt1563804000121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const fromBlock = process.env.STARTING_BLOCK || 0;
    const chainId = process.env.CHAIN_ID || testChainId;
    const usdtAddr = process.env.USDT_ADDR || wallet;

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
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        1215,
        '0xdac17f958d2ee523a2206206994597c13d831ec7',
        1,
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        'Tether USD',
        'USDT',
        6,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2215,
        '0x55d398326f99059ff775485246999027b3197955',
        56,
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        'Tether USD',
        'USDT',
        6,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3215,
        '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        137,
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        'Tether USD',
        'USDT',
        6,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4215,
        '${usdtAddr}',
        '${chainId}',
        'USDT',
        '${simpleFormatting}',
        '${imageUrl}',
        'Tether USD',
        'USDT',
        6,
        0,
        '',
        'ACTIVE',
        'ERC20',
        '{EXTERNAL}',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
