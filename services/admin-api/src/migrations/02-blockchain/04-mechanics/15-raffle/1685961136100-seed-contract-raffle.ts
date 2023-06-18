import { MigrationInterface, QueryRunner } from "typeorm";
import { CronExpression } from "@nestjs/schedule";

import { wallet } from "@gemunion/constants";
import { ns, testChainId } from "@framework/constants";

export class SeedContractRaffleAt1685961136100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const chainId = process.env.CHAIN_ID || testChainId;
    const raffleAddr = process.env.RAFFLE_ADDR || wallet;
    const fromBlock = process.env.STARTING_BLOCK || 0;

    const raffleOptions = JSON.stringify({
      schedule: CronExpression.EVERY_WEEKEND,
      description: "Weekend Raffle",
    });

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
          merchant_id,
          created_at,
          updated_at
        ) VALUES (
          21,
          '${raffleAddr}',
          '${chainId}',
          'RAFFLE',
          '${raffleOptions}',
          '',
          'Raffle',
          '',
          '',
          'ACTIVE',
          null,
          '{RANDOM, ALLOWANCE}',
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
