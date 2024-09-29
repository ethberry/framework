import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { wallets, NodeEnv } from "@ethberry/constants";
import { ns } from "@framework/constants";

export class SeedStakingDepositErc20Erc721At1654751224323 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

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
        2301,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 3 - 7).toISOString()}',
        123, -- ERC20 > ERC721
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'CANCELED',
        2302,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 3 - 7).toISOString()}',
        123, -- ERC20 > ERC721
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'COMPLETE',
        2303,
        '${subDays(now, 2).toISOString()}',
        '${subDays(now, 2 - 7).toISOString()}',
        123, -- ERC20 > ERC721
        1,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        2304,
        '${subDays(now, 2).toISOString()}',
        '${subDays(now, 2 - 7).toISOString()}',
        123, -- ERC20 > ERC721
        1,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        2305,
        '${subDays(now, 1).toISOString()}',
        '${subDays(now, 1 - 7).toISOString()}',
        123, -- ERC20 > ERC721
        1,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        2306,
        '${subDays(now, 1).toISOString()}',
        '${subDays(now, 1 - 7).toISOString()}',
        123, -- ERC20 > ERC721
        1,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        2307,
        '${subDays(now, 1).toISOString()}',
        '${subDays(now, 1 - 7).toISOString()}',
        123, -- ERC20 > ERC721
        1,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_deposit`);
  }
}
