import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { simpleFormatting } from "@ethberry/draft-js-utils";
import { NodeEnv } from "@ethberry/constants";
import { ns, testChainId } from "@framework/constants";

export class SeedContractChainLinkVrfAt1563804000105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        VRF_ADDR: Wallet.createRandom().address.toLowerCase(),
        VRF_BINANCE_ADDR: Wallet.createRandom().address.toLowerCase(),
        VRF_BINANCE_TEST_ADDR: Wallet.createRandom().address.toLowerCase(),
        VRF_POLYGON_ADDR: Wallet.createRandom().address.toLowerCase(),
        VRF_POLYGON_AMOY_ADDR: Wallet.createRandom().address.toLowerCase(),
        LINK_ADDR: Wallet.createRandom().address.toLowerCase(),
        LINK_BINANCE_ADDR: Wallet.createRandom().address.toLowerCase(),
        LINK_BINANCE_TEST_ADDR: Wallet.createRandom().address.toLowerCase(),
        LINK_POLYGON_ADDR: Wallet.createRandom().address.toLowerCase(),
        LINK_POLYGON_AMOY_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID_ETHBERRY || process.env.CHAIN_ID_ETHBERRY_BESU || testChainId;

    const vrfAddress = process.env.VRF_ADDR;
    const vrfAddressB = process.env.VRF_BINANCE_ADDR;
    const vrfAddressBt = process.env.VRF_BINANCE_TEST_ADDR;
    const vrfAddressP = process.env.VRF_POLYGON_ADDR;
    const vrfAddressPa = process.env.VRF_POLYGON_AMOY_ADDR;
    const linkAddr = process.env.LINK_ADDR;
    const linkAddrB = process.env.LINK_BINANCE_ADDR;
    const linkAddrBt = process.env.LINK_BINANCE_TEST_ADDR;
    const linkAddrP = process.env.LINK_POLYGON_ADDR;
    const linkAddrPa = process.env.LINK_POLYGON_AMOY_ADDR;

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
        ${process.env.NODE_ENV === NodeEnv.production ? 131 : 103},
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
        ${process.env.NODE_ENV === NodeEnv.production ? 132 : 203},
        '${vrfAddressB}',
        56,
        'VRF COORDINATOR (BNB)',
        '${simpleFormatting}',
        '',
        'ChainLink VRF',
        '',
        '',
        '${JSON.stringify({
          linkAddress: `${linkAddrB}`,
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
        ${process.env.NODE_ENV === NodeEnv.production ? 133 : 303},
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
        ${process.env.NODE_ENV === NodeEnv.production ? 134 : 403},
        '${vrfAddressP}',
        137,
        'VRF COORDINATOR (MATIC)',
        '${simpleFormatting}',
        '',
        'ChainLink VRF',
        '',
        '',
        '${JSON.stringify({
          linkAddress: `${linkAddrP}`,
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
        ${process.env.NODE_ENV === NodeEnv.production ? 135 : 503},
        '${vrfAddressBt}',
        97,
        'VRF COORDINATOR (tBNB)',
        '${simpleFormatting}',
        '',
        'ChainLink VRF',
        '',
        '',
        '${JSON.stringify({
          linkAddress: `${linkAddrBt}`,
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
        ${process.env.NODE_ENV === NodeEnv.production ? 136 : 603},
        '${vrfAddressPa}',
        8002,
        'VRF COORDINATOR (AMOY)',
        '${simpleFormatting}',
        '',
        'ChainLink VRF',
        '',
        '',
        '${JSON.stringify({
          linkAddress: `${linkAddrPa}`,
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
