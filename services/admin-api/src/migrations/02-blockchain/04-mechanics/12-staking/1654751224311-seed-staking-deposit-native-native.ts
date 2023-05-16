import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedStakingDepositNativeNativeAt1654751224311 implements MigrationInterface {
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
        1101,
        '${subDays(now, 9).toISOString()}',
        '${subDays(now, 9 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        1102,
        '${subDays(now, 9).toISOString()}',
        '${subDays(now, 9 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        1103,
        '${subDays(now, 8).toISOString()}',
        '${subDays(now, 8 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'CANCELED',
        1104,
        '${subDays(now, 7).toISOString()}',
        '${subDays(now, 7 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'COMPLETE',
        1105,
        '${subDays(now, 7).toISOString()}',
        '${subDays(now, 7 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        1106,
        '${subDays(now, 5).toISOString()}',
        '${subDays(now, 5 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        1107,
        '${subDays(now, 5).toISOString()}',
        '${subDays(now, 5 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'CANCELED',
        1108,
        '${subDays(now, 5).toISOString()}',
        '${subDays(now, 5 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        1109,
        '${subDays(now, 4).toISOString()}',
        '${subDays(now, 4 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        1110,
        '${subDays(now, 4).toISOString()}',
        '${subDays(now, 4 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        1111,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 3 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        1112,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 3 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        1113,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 3 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        1114,
        '${subDays(now, 2).toISOString()}',
        '${subDays(now, 2 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        1115,
        '${subDays(now, 1).toISOString()}',
        '${subDays(now, 1 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        1116,
        '${subDays(now, 1).toISOString()}',
        '${subDays(now, 1 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        1117,
        '${subDays(now, 0).toISOString()}',
        '${subDays(now, 0 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        1118,
        '${subDays(now, 0).toISOString()}',
        '${subDays(now, 0 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        1119,
        '${subDays(now, 0).toISOString()}',
        '${subDays(now, 0 - 7).toISOString()}',
        11, -- NATIVE > NATIVE
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
