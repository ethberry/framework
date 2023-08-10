import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedStakingDepositErc998Erc1155At1654751224345 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
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
        4501,
        '${subDays(now, 5).toISOString()}',
        '${subDays(now, 5 - 7).toISOString()}',
        45, -- ERC998 > ERC1155
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'CANCELED',
        4502,
        '${subDays(now, 5).toISOString()}',
        '${subDays(now, 5 - 7).toISOString()}',
        45, -- ERC998 > ERC1155
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'COMPLETE',
        4503,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 3 - 7).toISOString()}',
        45, -- ERC998 > ERC1155
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        4504,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 3 - 7).toISOString()}',
        45, -- ERC998 > ERC1155
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        4505,
        '${subDays(now, 0).toISOString()}',
        '${subDays(now, 0 - 7).toISOString()}',
        45, -- ERC998 > ERC1155
        1,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        4506,
        '${subDays(now, 0).toISOString()}',
        '${subDays(now, 0 - 7).toISOString()}',
        45, -- ERC998 > ERC1155
        1,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        4507,
        '${subDays(now, 0).toISOString()}',
        '${subDays(now, 0 - 7).toISOString()}',
        45, -- ERC998 > ERC1155
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
