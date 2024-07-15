import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns, testChainId } from "@framework/constants";
import { NodeEnv } from "@framework/types";

Object.assign(
  process.env,
  {
    CONTRACT_MANAGER_ADDR: Wallet.createRandom().address.toLowerCase(),
    CONTRACT_MANAGER_BINANCE_ADDR: Wallet.createRandom().address.toLowerCase(),
  },
  process.env,
);

export class SeedContractManagerAt1563804000101 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;
    const fromBlock = process.env.STARTING_BLOCK || 0;
    const contractManagerAddress = process.env.CONTRACT_MANAGER_ADDR;
    const contractManagerAddressBinance = process.env.CONTRACT_MANAGER_BINANCE_ADDR;
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
        contract_features,
        contract_module,
        from_block,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        ${process.env.NODE_ENV === NodeEnv.production ? "DEFAULT" : 101},
        '${contractManagerAddress}',
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
        ${process.env.NODE_ENV === NodeEnv.production ? 56 : 97},
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
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
