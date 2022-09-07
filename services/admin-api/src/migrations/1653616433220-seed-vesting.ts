import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedVesting1653616433210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const vestingLinearAddress = process.env.VESTING_LINEAR_ADDR || wallet;
    const vestingGradedAddress = process.env.VESTING_GRADED_ADDR || wallet;
    const vestingCliffAddress = process.env.VESTING_CLIFF_ADDR || wallet;
    const chainId = process.env.CHAIN_ID || 1337;
    const fromBlock = process.env.STARTING_BLOCK || 0;

    await queryRunner.query(`
      INSERT INTO ${ns}.vesting (
        address,
        account,
        duration,
        start_timestamp,
        contract_template,
        chain_id,
        from_block,
        created_at,
        updated_at
      ) VALUES (
        '${vestingLinearAddress}',
        '${wallet}',
        31536000000,
        '${currentDateTime}',
        'LINEAR',
        '${chainId}',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${vestingGradedAddress}',
        '${wallet}',
        31536000,
        '${currentDateTime}',
        'GRADED',
        '${chainId}',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${vestingCliffAddress}',
        '${wallet}',
        31536000,
        '${currentDateTime}',
        'CLIFF',
        '${chainId}',
        '${fromBlock}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.vesting RESTART IDENTITY CASCADE;`);
  }
}
