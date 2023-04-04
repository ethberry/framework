import { MigrationInterface, QueryRunner } from "typeorm";
import { addDays, subDays } from "date-fns";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedStakingDepositErc20Erc20At1654751224322 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const now = new Date();
    const currentDateTime = now.toISOString();
    const endDateTime = addDays(now, 30).toISOString();

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
        2201,
        '${currentDateTime}',
        '${endDateTime}',
        22, -- ERC20 > ERC20
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'CANCELED',
        2202,
        '${currentDateTime}',
        '${endDateTime}',
        22, -- ERC20 > ERC20
        1,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'COMPLETE',
        2203,
        '${currentDateTime}',
        '${endDateTime}',
        22, -- ERC20 > ERC20
        1,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        2204,
        '${currentDateTime}',
        '${endDateTime}',
        22, -- ERC20 > ERC20
        1,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        2205,
        '${currentDateTime}',
        '${endDateTime}',
        22, -- ERC20 > ERC20
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
