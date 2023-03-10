import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedPyramidDepositErc20At1660436477320 implements MigrationInterface {
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
        201,
        '${currentDateTime}',
        '${currentDateTime}',
        4, -- ERC20 > ERC20
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'CANCELED',
        202,
        '${currentDateTime}',
        '${currentDateTime}',
        4, -- ERC20 > ERC20
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'COMPLETE',
        203,
        '${currentDateTime}',
        '${currentDateTime}',
        4, -- ERC20 > ERC20
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        211,
        '${currentDateTime}',
        '${currentDateTime}',
        4, -- ERC20 > ERC20
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        221,
        '${currentDateTime}',
        '${currentDateTime}',
        4, -- ERC20 > ERC20
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
