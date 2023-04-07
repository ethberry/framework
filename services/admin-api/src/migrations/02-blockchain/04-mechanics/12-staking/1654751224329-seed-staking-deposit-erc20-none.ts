import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedStakingDepositErc20NoneAt1654751224329 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const now = new Date();
    const currentDateTime = now.toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.staking_deposit (
        account,
        staking_deposit_status,
        external_id,
        start_timestamp,
        withdraw_timestamp,
        staking_rule_id,
        multiplier,
        created_at,
        updated_at
      ) VALUES (
        '${wallets[0]}',
        'ACTIVE',
        2901,
        '${subDays(now, 5).toISOString()}',
        '${subDays(now, 5 - 7).toISOString()}',
        29, -- ERC20 > NONE
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'CANCELED',
        2902,
        '${subDays(now, 4).toISOString()}',
        '${subDays(now, 4 - 7).toISOString()}',
        29, -- ERC20 > NONE
        1,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'COMPLETE',
        2903,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 3 - 7).toISOString()}',
        29, -- ERC20 > NONE
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        2904,
        '${subDays(now, 2).toISOString()}',
        '${subDays(now, 2 - 7).toISOString()}',
        29, -- ERC20 > NONE
        1,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        2905,
        '${subDays(now, 0).toISOString()}',
        '${subDays(now, 0 - 7).toISOString()}',
        29, -- ERC20 > NONE
        1,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_deposit`);
  }
}
