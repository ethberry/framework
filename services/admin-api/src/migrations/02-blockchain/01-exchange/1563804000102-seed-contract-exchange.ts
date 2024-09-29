import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { simpleFormatting } from "@ethberry/draft-js-utils";
import { NodeEnv } from "@ethberry/constants";
import { ns, testChainId } from "@framework/constants";

export class SeedContractExchangeAt1563804000102 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        EXCHANGE_ADDR: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_ADDR_BINANCE: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_ADDR_BINANCE_TEST: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_ADDR_ETHEREUM: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_ADDR_POLYGON: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_ADDR_POLYGON_AMOY: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID_GEMUNION || process.env.CHAIN_ID_GEMUNION_BESU || testChainId;

    const exchangeGemunionAddress = process.env.EXCHANGE_ADDR;
    const exchangeAddressBinance = process.env.EXCHANGE_ADDR_BINANCE;
    const exchangeAddressBinanceTest = process.env.EXCHANGE_ADDR_BINANCE_TEST;
    const exchangeAddressPolygon = process.env.EXCHANGE_ADDR_POLYGON;
    const exchangeAddressPolygonAmoy = process.env.EXCHANGE_ADDR_POLYGON_AMOY;
    const exchangeAddressMainnet = process.env.EXCHANGE_ADDR_ETHEREUM;

    const fromBlock = process.env.STARTING_BLOCK || 1;
    const fromBlockBinance = process.env.STARTING_BLOCK_BINANCE || 1;
    const fromBlockBinanceTest = process.env.STARTING_BLOCK_BINANCE_TEST || 1;
    const fromBlockPolygon = process.env.STARTING_BLOCK_POLYGON || 1;
    const fromBlockPolygonAmoy = process.env.STARTING_BLOCK_POLYGON_AMOY || 1;
    const fromBlockEthereum = process.env.STARTING_BLOCK_ETHEREUM || 1;

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
        ${process.env.NODE_ENV === NodeEnv.production ? 111 : 102},
        '${exchangeGemunionAddress}',
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
        ${process.env.NODE_ENV === NodeEnv.production ? 112 : 202},
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
        ${process.env.NODE_ENV === NodeEnv.production ? 113 : 302},
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
        '${fromBlockEthereum}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 114 : 402},
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
        '${fromBlockPolygon}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? 115 : 502},
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
        ${process.env.NODE_ENV === NodeEnv.production ? 116 : 602},
        '${exchangeAddressPolygonAmoy}',
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
        '${fromBlockPolygonAmoy}',
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
