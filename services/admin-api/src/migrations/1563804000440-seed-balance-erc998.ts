import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceErc998At1563804020440 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const erc998ContractRandomAddress = process.env.ERC998_RANDOM_ADDR || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        created_at,
        updated_at
      ) VALUES (
        '${erc998ContractRandomAddress}',
        1,
        405001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        406001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        406002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        406003,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        407001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        411001,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
