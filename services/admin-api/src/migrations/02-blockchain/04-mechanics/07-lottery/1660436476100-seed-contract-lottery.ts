import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns, testChainId } from "@framework/constants";
import { CronExpression, NodeEnv } from "@framework/types";

Object.assign(
  process.env,
  {
    LOTTERY_ADDR: Wallet.createRandom().address.toLowerCase(),
  },
  process.env,
);

export class SeedContractLotteryAt1660436476100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;
    const lotteryAddr = process.env.LOTTERY_ADDR;
    const fromBlock = process.env.STARTING_BLOCK || 0;

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
          12401,
          '${lotteryAddr}',
          '${chainId}',
          'LOTTERY',
          '${simpleFormatting}',
          '${imageUrl}',
          'Lottery',
          '',
          '',
          '${JSON.stringify({
            timeLagBeforeRelease: "100",
            commission: "30",
            schedule: CronExpression.EVERY_DAY_AT_MIDNIGHT,
            roundId: 103,
          })}',
          'ACTIVE',
          null,
          '{RANDOM,ALLOWANCE,PAUSABLE}',
          'LOTTERY',
          '${fromBlock}',
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
