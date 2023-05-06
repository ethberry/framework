import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceErc20At1563804020420 implements MigrationInterface {
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
        '${WeiPerEther.toString()}',
        12010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        '${WeiPerEther.toString()}',
        12010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        '${WeiPerEther.toString()}',
        12040101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        '${WeiPerEther.toString()}',
        12150101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
