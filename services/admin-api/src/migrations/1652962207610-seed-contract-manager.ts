import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedContractManager1652962207610 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const contractManagerAddress = process.env.CONTRACT_MANAGER_ADDR || wallet;
    const exchangeAddr = process.env.EXCHANGE_ADDR || wallet;
    const stakingAddr = process.env.STAKING_ADDR || wallet;
    const claimAddr = process.env.CLAIM_PROXY_ADDR || wallet;
    const lotteryAddr = process.env.LOTTERY_ADDR || wallet;
    const erc20Addr = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc721Addr = process.env.ERC721_LOTTERY_ADDR || wallet;

    const lastBlock = process.env.STARTING_BLOCK || 0;

    await queryRunner.query(`
        INSERT INTO ${ns}.contract_manager (address,
                                            contract_type,
                                            from_block,
                                            created_at,
                                            updated_at)
        VALUES ('${contractManagerAddress}',
                'CONTRACT_MANAGER',
                '${lastBlock}',
                '${currentDateTime}',
                '${currentDateTime}'),
               ('${exchangeAddr}',
                'EXCHANGE',
                '${lastBlock}',
                '${currentDateTime}',
                '${currentDateTime}'),
               ('${stakingAddr}',
                'STAKING',
                '${lastBlock}',
                '${currentDateTime}',
                '${currentDateTime}'),
               ('${lotteryAddr}',
                'LOTTERY',
                '${lastBlock}',
                '${currentDateTime}',
                '${currentDateTime}'),
               ('${claimAddr}',
                'CLAIM',
                '${lastBlock}',
                '${currentDateTime}',
                '${currentDateTime}'),
               ('${erc20Addr}',
                'ERC20_TOKEN',
                '${lastBlock}',
                '${currentDateTime}',
                '${currentDateTime}'),
               ('${erc721Addr}',
                'ERC721_TOKEN',
                '${lastBlock}',
                '${currentDateTime}',
                '${currentDateTime}');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract_manager RESTART IDENTITY CASCADE;`);
  }
}
