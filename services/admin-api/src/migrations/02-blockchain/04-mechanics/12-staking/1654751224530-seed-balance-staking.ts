import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedBalanceStakingAt1654751224530 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const stakingAddr = process.env.STAKING_ADDR;

    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        created_at,
        updated_at
      ) VALUES (
        '${stakingAddr}',
        '${(100n * WeiPerEther).toString()}',
        101010101, -- BESU
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${stakingAddr}',
        '${(100n * WeiPerEther).toString()}',
        102010101, -- Space Credits
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
