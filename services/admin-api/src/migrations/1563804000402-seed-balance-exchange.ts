import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

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
        '${constants.WeiPerEther.mul(1e3).toString()}',
        12010101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
