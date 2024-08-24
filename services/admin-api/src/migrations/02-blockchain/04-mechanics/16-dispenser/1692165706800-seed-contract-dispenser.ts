import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedContractDispenserAt1692165706800 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    populate(
      process.env as any,
      {
        DISPENSER_ADDR: Wallet.createRandom().address.toLowerCase(),
        DISPENSER_BINANCE_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID_GEMUNION || process.env.CHAIN_ID_GEMUNION_BESU || testChainId;
    const dispenserAddr = process.env.DISPENSER_ADDR;
    const dispenserAddrBinance = process.env.DISPENSER_BINANCE_ADDR;
    const fromBlock = process.env.STARTING_BLOCK || 0;
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
          ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 108},
          '${dispenserAddr}',
          '${chainId}',
          'DISPENSER',
          '${simpleFormatting}',
          '${imageUrl}',
          'Dispenser',
          '',
          '',
          '${JSON.stringify({})}',
          'ACTIVE',
          null,
          '{}',
          'DISPENSER',
          '${fromBlock}',
          1,
          '${currentDateTime}',
          '${currentDateTime}'
        ), (
          ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 208},
          '${dispenserAddrBinance}',
          ${process.env.NODE_ENV === NodeEnv.production ? 56 : 97},
          'DISPENSER (BNB)',
          '${simpleFormatting}',
          '${imageUrl}',
          'Dispenser',
          '',
          '',
          '${JSON.stringify({})}',
          'ACTIVE',
          null,
          '{}',
          'DISPENSER',
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
