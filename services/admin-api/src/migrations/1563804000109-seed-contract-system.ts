import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedContractSystemAt1563804000109 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || 1337;
    const fromBloack = process.env.STARTING_BLOCK || 0;

    const contractManagerAddress = process.env.CONTRACT_MANAGER_ADDR || wallet;
    const exchangeAddr = process.env.EXCHANGE_ADDR || wallet;
    const stakingAddr = process.env.STAKING_ADDR || wallet;
    const claimAddr = process.env.CLAIM_PROXY_ADDR || wallet;
    const lotteryAddr = process.env.LOTTERY_ADDR || wallet;

    const emptyJson = JSON.stringify({});

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
        created_at,
        updated_at
      ) VALUES (
        1,
        '${contractManagerAddress}',
        '${chainId}',
        'CONTRACT MANAGER',
        '${emptyJson}',
        '',
        'ContractManager',
        '',
        '',
        'ACTIVE',
        'NATIVE',
        '{}',
        'SYSTEM',
        '${fromBloack}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        '${exchangeAddr}',
        '${chainId}',
        'EXCHANGE',
        '${emptyJson}',
        '',
        'Exchange',
        '',
        '',
        'ACTIVE',
        'NATIVE',
        '{}',
        'SYSTEM',
        '${fromBloack}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        '${stakingAddr}',
        '${chainId}',
        'STAKING',
        '${emptyJson}',
        '',
        'Staking',
        '',
        '',
        'ACTIVE',
        'NATIVE',
        '{}',
        'SYSTEM',
        '${fromBloack}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        '${claimAddr}',
        '${chainId}',
        'CLAIM PROXY',
        '${emptyJson}',
        '',
        'ClaimProxy',
        '',
        '',
        'ACTIVE',
        'NATIVE',
        '{}',
        'SYSTEM',
        '${fromBloack}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        '${lotteryAddr}',
        '${chainId}',
        'LOTTERY',
        '${emptyJson}',
        '',
        'Lottery',
        '',
        '',
        'ACTIVE',
        'NATIVE',
        '{}',
        'SYSTEM',
        '${fromBloack}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 5, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
