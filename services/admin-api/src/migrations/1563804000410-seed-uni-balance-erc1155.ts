import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceErc1155At1563804020410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        '${constants.WeiPerEther.toString()}',
        40101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        '${constants.WeiPerEther.toString()}',
        40102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        '${constants.WeiPerEther.toString()}',
        40103,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc1155_balance RESTART IDENTITY CASCADE;`);
  }
}
