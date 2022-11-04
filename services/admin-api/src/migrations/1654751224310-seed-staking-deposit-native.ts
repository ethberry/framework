import { MigrationInterface, QueryRunner } from "typeorm";
import { addDays } from "date-fns";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedStakingDepositNativeAt1654751224310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const endDateTime = addDays(new Date(), 30).toISOString();

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
        101,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        102,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        103,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'CANCELED',
        104,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'COMPLETE',
        105,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        111,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        112,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'CANCELED',
        113,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        114,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        115,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        116,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        117,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        121,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        122,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        123,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        124,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        125,
        '${currentDateTime}',
        '${endDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_deposit`);
  }
}
