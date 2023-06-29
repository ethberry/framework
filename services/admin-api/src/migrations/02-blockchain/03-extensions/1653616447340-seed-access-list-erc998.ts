import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedAccessListErc998At1653616447340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc998ContractBlacklistAddress = process.env.ERC998_BLACKLIST_ADDR || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.access_list (
        address,
        account,
        allowance,
        created_at,
        updated_at
      ) VALUES (
        '${erc998ContractBlacklistAddress}',
        '${wallets[0]}',
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractBlacklistAddress}',
        '${wallets[1]}',
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractBlacklistAddress}',
        '${wallets[2]}',
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.access_list RESTART IDENTITY CASCADE;`);
  }
}
