import { MigrationInterface, QueryRunner } from "typeorm";
import { addDays, subDays } from "date-fns";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedStakingDepositNativeNativeAt1654751224311 implements MigrationInterface {
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
        1101,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        1102,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        1103,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'CANCELED',
        1104,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'COMPLETE',
        1105,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        1106,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        1107,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'CANCELED',
        1108,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        1109,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        1110,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        1111,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        1112,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        1113,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        1114,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        1115,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        1116,
        '${currentDateTime}',
        '${endDateTime}',
        11, -- NATIVE > NATIVE
        1,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        1117,
        '${currentDateTime}',
        '${endDateTime}',
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
