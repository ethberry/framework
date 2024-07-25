import { MigrationInterface, QueryRunner } from "typeorm";
import { Wallet } from "ethers";
import { populate } from "dotenv";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { imageUrl, ns, testChainId } from "@framework/constants";
import { CronExpression, NodeEnv } from "@framework/types";

export class SeedContractRaffleAt1685961136100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    populate(
      process.env as any,
      {
        RAFFLE_ADDR: Wallet.createRandom().address.toLowerCase(),
      },
      process.env as any,
    );

    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;
    const raffleAddr = process.env.RAFFLE_ADDR;
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
          12201,
          '${raffleAddr}',
          '${chainId}',
          'RAFFLE',
          '${simpleFormatting}',
          '${imageUrl}',
          'Raffle',
          '',
          '',
          '${JSON.stringify({
            timeLagBeforeRelease: "100",
            commission: "30",
            schedule: CronExpression.EVERY_WEEKEND,
            roundId: 103,
          })}',
          'ACTIVE',
          null,
          '{RANDOM,ALLOWANCE,PAUSABLE}',
          'RAFFLE',
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
