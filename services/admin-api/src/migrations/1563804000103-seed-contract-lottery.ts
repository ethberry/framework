import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedContractLotteryAt1563804000103 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || 1337;
    const lotteryAddr = process.env.LOTTERY_ADDR || wallet;
    const fromBlock = process.env.STARTING_BLOCK || 0;

    await queryRunner.query(`
        INSERT INTO ${ns}.contract (id,
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
                                    updated_at)
        VALUES (8,
                '${lotteryAddr}',
                '${chainId}',
                'LOTTERY',
                '${JSON.stringify({})}',
                '',
                'Lottery',
                '',
                '',
                'ACTIVE',
                null,
                '{RANDOM, ALLOWANCE}',
                'LOTTERY',
                '${fromBlock}',
                '${currentDateTime}',
                '${currentDateTime}');
    `);

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 8, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.contract RESTART IDENTITY CASCADE;`);
  }
}
