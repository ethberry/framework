import { MigrationInterface, QueryRunner } from "typeorm";
import { BigNumber, constants } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceExchangeAt1563804020402 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const exchangeAddressBinance = process.env.EXCHANGE_ADDR_BINANCE || wallet;

    // BESU
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
        11010101, -- BESU
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddress}',
        '${BigNumber.from(1e2).mul(constants.WeiPerEther).toString()}',
        12010101, -- Space Credits
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddress}',
        '${BigNumber.from(1e2).mul(1e6).toString()}', -- USDT has 6 places after decimal
        12150101, -- USDT
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddress}',
        '${BigNumber.from(1e2).mul(constants.WeiPerEther).toString()}',
        12160101, -- WETH
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    // BINANCE
    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        created_at,
        updated_at
      ) VALUES (
        '${exchangeAddressBinance}',
        '${BigNumber.from(1e2).mul(constants.WeiPerEther).toString()}',
        21010101, -- BNB
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddressBinance}',
        '${BigNumber.from(1e2).mul(1e6).toString()}', -- USDT has 6 places after decimal
        22150101, -- USDT
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddressBinance}',
        '${BigNumber.from(1e2).mul(constants.WeiPerEther).toString()}',
        22160101, -- WETH
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddressBinance}',
        '${BigNumber.from(1e2).mul(constants.WeiPerEther).toString()}',
        22170101, -- BUSD
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
