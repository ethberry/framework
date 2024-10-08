import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { Networks } from "@ethberry/types-blockchain";
import { simpleFormatting } from "@ethberry/draft-js-utils";
import { NodeEnv } from "@ethberry/constants";
import { networks, ns } from "@framework/constants";

const chainIdToSuffix = (chainId: string | bigint | number) => {
  return Object.keys(Networks)[Object.values(Networks).indexOf(Number(chainId))];
};

export class SeedContractExchangeAt1563804000102 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        EXCHANGE_ADDR_ETHBERRY: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_ADDR_ETHBERRY_BESU: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_ADDR_ETHEREUM: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_ADDR_ETHEREUM_SEPOLIA: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_ADDR_BINANCE: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_ADDR_BINANCE_TEST: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_ADDR_POLYGON: Wallet.createRandom().address.toLowerCase(),
        EXCHANGE_ADDR_POLYGON_AMOY: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();

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
        merchant_id,
        created_at,
        updated_at
      ) VALUES ${Object.values(networks)
        .map(network => {
          return `(
            ${network.order}02,
            '${process.env[`EXCHANGE_ADDR_${chainIdToSuffix(network.chainId)}`]}',
            ${network.chainId},
            'EXCHANGE (${chainIdToSuffix(network.chainId)})',
            '${simpleFormatting}',
            '',
            'EXCHANGE',
            '',
            '',
            'ACTIVE',
            null,
            '{WITHDRAW,ALLOWANCE,REFERRAL}',
            'EXCHANGE',
            1,
            '${currentDateTime}',
            '${currentDateTime}'
          )`;
        })
        .join(", ")};
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
