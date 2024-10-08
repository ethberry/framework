import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { Networks } from "@ethberry/types-blockchain";
import { simpleFormatting } from "@ethberry/draft-js-utils";
import { NodeEnv } from "@ethberry/constants";
import { networks, ns } from "@framework/constants";
import { LinkTokenAddress, VrfCoordinatorV2PlusAddress } from "@framework/types";

const chainIdToSuffix = (chainId: string | bigint | number) => {
  return Object.keys(Networks)[Object.values(Networks).indexOf(Number(chainId))];
};

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
        merchant_id,
        created_at,
        updated_at
      ) VALUES ${Object.values(networks)
        .map(network => {
          return `(
            ${network.order}03,
            '${VrfCoordinatorV2PlusAddress[chainIdToSuffix(network.chainId) as keyof typeof VrfCoordinatorV2PlusAddress]}',
            ${network.chainId},
            'VRF COORDINATOR (${chainIdToSuffix(network.chainId)})',
            '${simpleFormatting}',
            '',
            'VRF_COORDINATOR',
            '',
            '',
            '${JSON.stringify({
              linkAddress: LinkTokenAddress[chainIdToSuffix(network.chainId) as keyof typeof LinkTokenAddress],
            })}',
            'ACTIVE',
            null,
            '{}',
            'CHAIN_LINK',
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
