import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedPyramidDepositNativeAt1660436477310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.pyramid_deposit (
        account,
        pyramid_deposit_status,
        external_id,
        start_timestamp,
        withdraw_timestamp,
        pyramid_rule_id,
        multiplier,
        created_at,
        updated_at
      ) VALUES (
        '${wallets[0]}',
        'ACTIVE',
        101,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        102,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        103,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'CANCELED',
        104,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'COMPLETE',
        105,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        111,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        112,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'CANCELED',
        113,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        114,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        115,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        116,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        117,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        121,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        122,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        123,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        124,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        125,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.pyramid_deposit`);
  }
}
