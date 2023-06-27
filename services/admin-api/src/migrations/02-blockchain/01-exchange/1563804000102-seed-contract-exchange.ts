import { MigrationInterface, QueryRunner } from "typeorm";

import { ns, testChainId } from "@framework/constants";
import { wallet } from "@gemunion/constants";
import { simpleFormatting } from "@gemunion/draft-js-utils";

export class SeedContractExchangeAt1563804000102 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const exchangeAddressBinance = process.env.EXCHANGE_BINANCE_ADDR || wallet;
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
        base_token_uri,
        contract_status,
        contract_type,
        contract_features,
        contract_module,
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        102,
        '${exchangeAddress}',
        '${chainId}',
        'EXCHANGE (BESU)',
        '${simpleFormatting}',
        '',
        'Exchange',
        '',
        '',
        'ACTIVE',
        null,
        '{WITHDRAW,ALLOWANCE,SPLITTER,REFERRAL}',
        'SYSTEM',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        202,
        '${exchangeAddressBinance}',
        56,
        'EXCHANGE (BNB)',
        '${simpleFormatting}',
        '',
        'Exchange',
        '',
        '',
        'ACTIVE',
        null,
        '{WITHDRAW,ALLOWANCE,SPLITTER,REFERRAL}',
        'SYSTEM',
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
