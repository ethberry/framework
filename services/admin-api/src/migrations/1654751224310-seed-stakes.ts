import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedStakes1654751224310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.staking_stakes (
        account,
        stake_status,
        external_id,
        start_timestamp,
        withdraw_timestamp,
        staking_rule_id,
        multiplier,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        'ACTIVE',
        2,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        'ACTIVE',
        3,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        'CANCELED',
        4,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        'COMPLETE',
        5,
        '${currentDateTime}',
        '${currentDateTime}',
        1, -- NATIVE > NATIVE
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        'ACTIVE',
        6,
        '${currentDateTime}',
        '${currentDateTime}',
        8, -- ERC20 > ERC721
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        'ACTIVE',
        7,
        '${currentDateTime}',
        '${currentDateTime}',
        9, -- ERC20 > ERC998
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        'ACTIVE',
        8,
        '${currentDateTime}',
        '${currentDateTime}',
        10, -- ERC20 > ERC1155
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_stakes`);
  }
}
