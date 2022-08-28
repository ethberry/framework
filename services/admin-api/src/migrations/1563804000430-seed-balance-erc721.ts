import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceErc721At1563804020430 implements MigrationInterface {
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
        '${wallet}',
        1,
        301001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        301002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        301003,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        305001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        305002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        305003,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        305004,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        305005,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        305006,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        305007,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        305008,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        306001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        306002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        306003,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        307001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        311001,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
