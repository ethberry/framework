import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns } from "@framework/constants";

export class SeedContractErc20USDTAt1563804000121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const addr: Record<string, string> = {
      "1": "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "56": "0x55d398326f99059ff775485246999027b3197955",
      "137": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
      "1337": process.env.USDT_ADDR || wallet,
    };

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || 1337;
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
        205,
        '${addr[chainId]}',
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
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
