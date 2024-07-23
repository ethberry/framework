import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedContractExchangeAt1563804000102 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    populate(
      process.env as any,
      {
        EXCHANGE_ADDR: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_BINANCE_ADDR: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_BINANCE_TEST_ADDR: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_ETH_ADDR: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_POLYGON_ADDR: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_POLYGON_AMOY_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;

    const exchangeGemunionBesuAddress = process.env.EXCHANGE_ADDR;
    const exchangeAddressBinance = process.env.EXCHANGE_BINANCE_ADDR;
    const exchangeAddressBinanceTest = process.env.EXCHANGE_BINANCE_TEST_ADDR;
    const exchangeAddressPolygon = process.env.EXCHANGE_POLYGON_ADDR;
    const exchangeAddressPolygonTest = process.env.EXCHANGE_POLYGON_AMOY_ADDR;
    const exchangeAddressMainnet = process.env.EXCHANGE_ETH_ADDR;

    const fromBlock = process.env.STARTING_BLOCK || 1;
    const fromBlockBinance = process.env.STARTING_BINANCE_BLOCK || 1;
    const fromBlockBinanceTest = process.env.STARTING_BINANCE_TEST_BLOCK || 1;

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
        '${exchangeGemunionBesuAddress}',
        '${chainId}',
        'EXCHANGE (BESU)',
        '${simpleFormatting}',
        '',
        'EXCHANGE',
        '',
        '',
        'ACTIVE',
        null,
        '{WITHDRAW,ALLOWANCE,REFERRAL}',
        'EXCHANGE',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 202},
        '${exchangeAddressBinance}',
        56,
        'EXCHANGE (BNB)',
        '${simpleFormatting}',
        '',
        'EXCHANGE',
        '',
        '',
        'ACTIVE',
        null,
        '{WITHDRAW,ALLOWANCE,REFERRAL}',
        'EXCHANGE',
        '${fromBlockBinance}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 302},
        '${exchangeAddressMainnet}',
        1,
        'EXCHANGE (ETH)',
        '${simpleFormatting}',
        '',
        'EXCHANGE',
        '',
        '',
        'ACTIVE',
        null,
        '{WITHDRAW,ALLOWANCE,REFERRAL}',
        'EXCHANGE',
        '${fromBlockBinance}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 402},
        '${exchangeAddressPolygon}',
        137,
        'EXCHANGE (MATIC)',
        '${simpleFormatting}',
        '',
        'EXCHANGE',
        '',
        '',
        'ACTIVE',
        null,
        '{WITHDRAW,ALLOWANCE,REFERRAL}',
        'EXCHANGE',
        '${fromBlockBinance}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 502},
        '${exchangeAddressBinanceTest}',
        97,
        'EXCHANGE (tBNB)',
        '${simpleFormatting}',
        '',
        'EXCHANGE',
        '',
        '',
        'ACTIVE',
        null,
        '{WITHDRAW,ALLOWANCE,REFERRAL}',
        'EXCHANGE',
        '${fromBlockBinanceTest}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 602},
        '${exchangeAddressPolygonTest}',
        80002,
        'EXCHANGE (tMATIC)',
        '${simpleFormatting}',
        '',
        'EXCHANGE',
        '',
        '',
        'ACTIVE',
        null,
        '{WITHDRAW,ALLOWANCE,REFERRAL}',
        'EXCHANGE',
        '${fromBlockBinanceTest}',
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
