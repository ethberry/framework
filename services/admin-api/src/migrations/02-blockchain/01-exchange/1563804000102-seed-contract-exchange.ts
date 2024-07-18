import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

Object.assign(
  process.env,
  {
    EXCHANGE_ADDR: Wallet.createRandom().address.toLowerCase(),
    EXCHANGE_BINANCE_ADDR: Wallet.createRandom().address.toLowerCase(),
  },
  process.env,
);

export class SeedContractExchangeAt1563804000102 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;
    const exchangeAddress = process.env.EXCHANGE_ADDR;
    const exchangeAddressBinance = process.env.EXCHANGE_BINANCE_ADDR;
    const fromBlock = process.env.STARTING_BLOCK || 1;
    const fromBlockBinance = process.env.STARTING_BINANCE_BLOCK || 1;

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
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 102},
        '${exchangeAddress}',
        '${chainId}',
        'EXCHANGE (BESU)',
        '${simpleFormatting}',
        '',
        'EXCHANGE',
        '',
        '',
        'ACTIVE',
        null,
        '{WITHDRAW,ALLOWANCE,SPLITTER,REFERRAL}',
        'EXCHANGE',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 202},
        '${exchangeAddressBinance}',
        ${process.env.NODE_ENV === NodeEnv.production ? 56 : 97},
        'EXCHANGE (BNB)',
        '${simpleFormatting}',
        '',
        'EXCHANGE',
        '',
        '',
        'ACTIVE',
        null,
        '{WITHDRAW,ALLOWANCE,SPLITTER,REFERRAL}',
        'EXCHANGE',
        '${fromBlockBinance}',
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
