import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedContractManager1652962207610 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const contractManagerAddress = process.env.CONTRACT_MANAGER_ADDR || wallet;
    const airdropAddr = process.env.AIRDROP_ADDR || wallet;
    const lootboxAddr = process.env.LOOTBOX_ADDR || wallet;
    const exchangeAddr = process.env.EXCHANGE_ADDR || wallet;
    const stakingAddr = process.env.STAKING_ADDR || wallet;

    const lastBlock = process.env.STARTING_BLOCK || 0;

    await queryRunner.query(`
      INSERT INTO ${ns}.contract_manager (
        address,
        contract_type,
        from_block,
        created_at,
        updated_at
      ) VALUES (
        '${contractManagerAddress}',
        'CONTRACT_MANAGER',
        '${lastBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${airdropAddr}',
        'AIRDROP',
        '${lastBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
       '${lootboxAddr}',
        'LOOTBOX',
        '${lastBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddr}',
        'EXCHANGE',
        '${lastBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${stakingAddr}',
        'STAKING',
        '${lastBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract_manager RESTART IDENTITY CASCADE;`);
  }
}
