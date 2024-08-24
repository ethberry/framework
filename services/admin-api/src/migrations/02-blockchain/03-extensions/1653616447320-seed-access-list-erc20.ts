import { MigrationInterface, QueryRunner } from "typeorm";

import { wallets, NodeEnv } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedAccessListErc20At1653616447320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc20TokenBlackListAddress = process.env.ERC20_BLACKLIST_ADDR;
    const erc20TokenWhiteListAddress = process.env.ERC20_WHITELIST_ADDR;

    await queryRunner.query(`
      INSERT INTO ${ns}.access_list (
        address,
        account,
        allowance,
        created_at,
        updated_at
      ) VALUES (
        '${erc20TokenBlackListAddress}',
        '${wallets[0]}',
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenBlackListAddress}',
        '${wallets[1]}',
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenBlackListAddress}',
        '${wallets[2]}',
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenWhiteListAddress}',
        '${wallets[1]}',
        true,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenWhiteListAddress}',
        '${wallets[1]}',
        true,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc20TokenWhiteListAddress}',
        '${wallets[2]}',
        true,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.access_list RESTART IDENTITY CASCADE;`);
  }
}
