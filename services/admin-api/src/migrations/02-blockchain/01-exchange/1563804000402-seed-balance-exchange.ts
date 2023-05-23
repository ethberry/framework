import { MigrationInterface, QueryRunner } from "typeorm";
import { BigNumber, constants } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceExchangeAt1563804020402 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        created_at,
        updated_at
      ) VALUES (
        '${exchangeAddress}',
        '${BigNumber.from(1e2).mul(constants.WeiPerEther).toString()}',
        21010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddress}',
        '${BigNumber.from(1e2).mul(constants.WeiPerEther).toString()}',
        11010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddress}',
        '${BigNumber.from(1e2).mul(constants.WeiPerEther).toString()}',
        12010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddress}',
        '${BigNumber.from(1e2).mul(constants.WeiPerEther).toString()}',
        12160101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddress}',
        '${BigNumber.from(1e2).mul(1e6).toString()}', -- USDT has 6 places after decimal
        12150101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddress}',
        '${BigNumber.from(1e2).mul(1e6).toString()}', -- USDT has 6 places after decimal
        22150101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddress}',
        '${BigNumber.from(1e2).mul(constants.WeiPerEther).toString()}',
        22170101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
