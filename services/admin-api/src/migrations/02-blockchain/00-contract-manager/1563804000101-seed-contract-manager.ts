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

export class SeedContractManagerAt1563804000101 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        CONTRACT_MANAGER_ADDR_ETHBERRY: Wallet.createRandom().address.toLowerCase(),
        CONTRACT_MANAGER_ADDR_ETHBERRY_BESU: Wallet.createRandom().address.toLowerCase(),
        CONTRACT_MANAGER_ADDR_ETHEREUM: Wallet.createRandom().address.toLowerCase(),
        CONTRACT_MANAGER_ADDR_ETHEREUM_SEPOLIA: Wallet.createRandom().address.toLowerCase(),
        CONTRACT_MANAGER_ADDR_BINANCE: Wallet.createRandom().address.toLowerCase(),
        CONTRACT_MANAGER_ADDR_BINANCE_TEST: Wallet.createRandom().address.toLowerCase(),
        CONTRACT_MANAGER_ADDR_POLYGON: Wallet.createRandom().address.toLowerCase(),
        CONTRACT_MANAGER_ADDR_POLYGON_AMOY: Wallet.createRandom().address.toLowerCase(),
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
            ${network.order}01,
            '${process.env[`CONTRACT_MANAGER_ADDR_${chainIdToSuffix(network.chainId)}`]}',
            ${network.chainId},
            'CONTRACT MANAGER (${chainIdToSuffix(network.chainId)})',
            '${simpleFormatting}',
            '',
            'CONTRACT_MANAGER',
            '',
            '',
            'ACTIVE',
            null,
            '{ALLOWANCE}',
            'CONTRACT_MANAGER',
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
