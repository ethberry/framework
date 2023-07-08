import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceExchangeAt1563804020402 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const exchangeAddressBinance = process.env.EXCHANGE_BINANCE_ADDR || wallet;

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
        '${(100n * WeiPerEther).toString()}',
        101010101, -- BESU
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddress}',
        '${(100n * WeiPerEther).toString()}',
        102010101, -- Space Credits
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddress}',
        '${(100n * 1000000n).toString()}', -- USDT has 6 places after decimal
        102150101, -- USDT
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddress}',
        '${(100n * WeiPerEther).toString()}',
        102160101, -- WETH
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddress}',
        '${(100n * WeiPerEther).toString()}',
        102170101, -- BUSD
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
        '${(100n * WeiPerEther).toString()}',
        201010101, -- BNB
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddressBinance}',
        '${(100n * 1000000n).toString()}', -- USDT has 6 places after decimal
        202150101, -- USDT
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddressBinance}',
        '${(100n * WeiPerEther).toString()}',
        202160101, -- WETH
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${exchangeAddressBinance}',
        '${(100n * WeiPerEther).toString()}',
        202170101, -- BUSD
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
