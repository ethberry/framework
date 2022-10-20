import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceErc1155At1563804020450 implements MigrationInterface {
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
        100,
        15010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1000,
        15010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        15010201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        15010301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        15040101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        15040201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        15040301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        25010101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
