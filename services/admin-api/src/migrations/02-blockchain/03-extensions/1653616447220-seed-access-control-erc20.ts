import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedAccessControlErc20At1653616447220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc20TokenInactiveAddress = process.env.ERC20_INACTIVE_ADDR || wallet;
    const erc20TokenNewAddress = process.env.ERC20_NEW_ADDR || wallet;
    const erc20TokenBlackListAddress = process.env.ERC20_BLACKLIST_ADDR || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.access_control (
        address,
        account,
        role,
        created_at,
        updated_at
      ) VALUES (
        '${erc20TokenSimpleAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenSimpleAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenSimpleAddress}',
        '${wallet}',
        'SNAPSHOT_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenInactiveAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenInactiveAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenInactiveAddress}',
        '${wallet}',
        'SNAPSHOT_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenNewAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenNewAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenNewAddress}',
        '${wallet}',
        'SNAPSHOT_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenBlackListAddress}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenBlackListAddress}',
        '${wallet}',
        'MINTER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenBlackListAddress}',
        '${wallet}',
        'SNAPSHOT_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.access_list RESTART IDENTITY CASCADE;`);
  }
}
