import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, testChainId } from "@framework/constants";

export class SeedContractChainLinkVrfAt1563804000105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    populate(
      process.env as any,
      {
        VRF_ADDR: Wallet.createRandom().address.toLowerCase(),
        LINK_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;

    const vrfAddress = process.env.VRF_ADDR;
    const linkAddr = process.env.LINK_ADDR;

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
        parameters,
        contract_status,
        contract_type,
        contract_features,
        contract_module,
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        107,
        '${vrfAddress}',
        '${chainId}',
        'VRF COORDINATOR (BESU)',
        '${simpleFormatting}',
        '',
        'ChainLink VRF',
        '',
        '',
        '${JSON.stringify({
          linkAddress: linkAddr.toLowerCase(),
        })}',
        'ACTIVE',
        null,
        '{}',
        'CHAIN_LINK',
        '${fromBlock}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        207,
        '0xc587d9053cd1118f25f645f9e08bb98c9712a4ee',
        56,
        'VRF COORDINATOR (BNB)',
        '${simpleFormatting}',
        '',
        'ChainLink VRF',
        '',
        '',
        '${JSON.stringify({
          linkAddress: "0x404460c6a5ede2d891e829779526fde62adbb75",
        })}',
        'ACTIVE',
        null,
        '{}',
        'CHAIN_LINK',
        '${fromBlockBinance}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        307,
        '0x271682deb8c4e0901d1a1550ad2e64d568e69909',
        1,
        'VRF COORDINATOR (ETH)',
        '${simpleFormatting}',
        '',
        'ChainLink VRF',
        '',
        '',
        '${JSON.stringify({
          linkAddress: "0x514910771af9ca656af840dff83e8264ecf986ca",
        })}',
        'ACTIVE',
        null,
        '{}',
        'CHAIN_LINK',
        '${fromBlockEthereum}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        407,
        '0xae975071be8f8ee67addbc1a82488f1c24858067',
        137,
        'VRF COORDINATOR (MATIC)',
        '${simpleFormatting}',
        '',
        'ChainLink VRF',
        '',
        '',
        '${JSON.stringify({
          linkAddress: "0xb0897686c545045afc77cf20ec7a532e3120e0f1",
        })}',
        'ACTIVE',
        null,
        '{}',
        'CHAIN_LINK',
        '${fromBlockPolygon}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        507,
        '0x6a2aad07396b36fe02a22b33cf443582f682c82f',
        97,
        'VRF COORDINATOR (tBNB)',
        '${simpleFormatting}',
        '',
        'ChainLink VRF',
        '',
        '',
        '${JSON.stringify({
          linkAddress: "0x84b9b910527ad5c03a9ca831909e21e236ea7b06",
        })}',
        'ACTIVE',
        null,
        '{}',
        'CHAIN_LINK',
        '${fromBlockBinanceTest}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        607,
        '0x7e10652cb79ba97bc1d0f38a1e8fad8464a8a908',
        8002,
        'VRF COORDINATOR (AMOY)',
        '${simpleFormatting}',
        '',
        'ChainLink VRF',
        '',
        '',
        '${JSON.stringify({
          linkAddress: "0x0fd9e8d3af1aaee056eb9e802c3a762a667b1904",
        })}',
        'ACTIVE',
        null,
        '{}',
        'CHAIN_LINK',
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
