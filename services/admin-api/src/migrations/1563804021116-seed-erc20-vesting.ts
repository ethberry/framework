import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedErc20Vesting1563804021116 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    const erc20TokenAddress = process.env.ERC20_COIN || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.erc20_vesting (
        address,
        token,
        amount,
        beneficiary,
        duration,
        start_timestamp,
        vesting_type,
        erc20_token_id,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        '${erc20TokenAddress}',
        '${constants.WeiPerEther.toString()}',
        '${wallet}',
        1234567890,
        '${currentDateTime}',
        'FLAT',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc20_vesting RESTART IDENTITY CASCADE;`);
  }
}
