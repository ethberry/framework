import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedContractManagerAt1563804000101 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    populate(
      process.env as any,
      {
        CONTRACT_MANAGER_ADDR: Wallet.createRandom().address.toLowerCase(),
        CONTRACT_MANAGER_BINANCE_ADDR: Wallet.createRandom().address.toLowerCase(),
        CONTRACT_MANAGER_BINANCE_TEST_ADDR: Wallet.createRandom().address.toLowerCase(),
        CONTRACT_MANAGER_POLYGON_ADDR: Wallet.createRandom().address.toLowerCase(),
        CONTRACT_MANAGER_POLYGON_AMOY_ADDR: Wallet.createRandom().address.toLowerCase(),
        CONTRACT_MANAGER_ETHEREUM_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;

    const contractManagerGemunionAddress = process.env.CONTRACT_MANAGER_ADDR;
    const contractManagerAddressBinance = process.env.CONTRACT_MANAGER_BINANCE_ADDR;
    const contractManagerAddressBinanceTest = process.env.CONTRACT_MANAGER_BINANCE_TEST_ADDR;
    const contractManagerAddressPolygon = process.env.CONTRACT_MANAGER_POLYGON_ADDR;
    const contractManagerAddressPolygonTest = process.env.CONTRACT_MANAGER_POLYGON_AMOY_ADDR;
    const contractManagerAddressMainnet = process.env.CONTRACT_MANAGER_ETHEREUM_ADDR;

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
        contract_features,
        contract_module,
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 101},
        '${contractManagerGemunionAddress}',
        '${chainId}',
        'CONTRACT MANAGER',
        '${simpleFormatting}',
        '',
        'CONTRACT_MANAGER',
        '',
        '',
        'ACTIVE',
        '{ALLOWANCE}',
        'CONTRACT_MANAGER',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 201},
        '${contractManagerAddressBinance}',
        56,
        'CONTRACT MANAGER (BNB)',
        '${simpleFormatting}',
        '',
        'CONTRACT_MANAGER',
        '',
        '',
        'ACTIVE',
        '{ALLOWANCE}',
        'CONTRACT_MANAGER',
        '${fromBlockBinance}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 301},
        '${contractManagerAddressMainnet}',
        1,
        'CONTRACT MANAGER (ETH)',
        '${simpleFormatting}',
        '',
        'CONTRACT_MANAGER',
        '',
        '',
        'ACTIVE',
        '{ALLOWANCE}',
        'CONTRACT_MANAGER',
        '${fromBlockEthereum}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 401},
        '${contractManagerAddressPolygon}',
        137,
        'CONTRACT MANAGER (MATIC)',
        '${simpleFormatting}',
        '',
        'CONTRACT_MANAGER',
        '',
        '',
        'ACTIVE',
        '{ALLOWANCE}',
        'CONTRACT_MANAGER',
        '${fromBlockPolygon}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 501},
        '${contractManagerAddressBinanceTest}',
        97,
        'CONTRACT MANAGER (tBNB)',
        '${simpleFormatting}',
        '',
        'CONTRACT_MANAGER',
        '',
        '',
        'ACTIVE',
        '{ALLOWANCE}',
        'CONTRACT_MANAGER',
        '${fromBlockBinanceTest}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 601},
        '${contractManagerAddressPolygonTest}',
        80002,
        'CONTRACT MANAGER (tMATIC)',
        '${simpleFormatting}',
        '',
        'CONTRACT_MANAGER',
        '',
        '',
        'ACTIVE',
        '{ALLOWANCE}',
        'CONTRACT_MANAGER',
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
