import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceStakingAt1654751224530 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const stakingAddr = process.env.STAKING_ADDR || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        created_at,
        updated_at
      ) VALUES (
        '${stakingAddr}',
        '${constants.WeiPerEther.mul(1e2).toString()}',
        11010101, -- BESU
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${stakingAddr}',
        '${constants.WeiPerEther.mul(1e2).toString()}',
        12010101, -- Space Credits
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
