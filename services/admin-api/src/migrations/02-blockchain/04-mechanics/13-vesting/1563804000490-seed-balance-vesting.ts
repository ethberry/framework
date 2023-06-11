import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceVestingAt1563804000490 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const vestingLinearAddress = process.env.VESTING_LINEAR_ADDR || wallet;
    const vestingGradedAddress = process.env.VESTING_GRADED_ADDR || wallet;
    const vestingCliffAddress = process.env.VESTING_CLIFF_ADDR || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        created_at,
        updated_at
      ) VALUES (
        '${vestingLinearAddress}',
        '${(100n * WeiPerEther).toString()}',
        12010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${vestingGradedAddress}',
        '${(100n * 1000000n).toString()}', -- USDT has 6 places after decimal
        12150101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${vestingCliffAddress}',
        '${(100n * WeiPerEther).toString()}',
        12170101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
