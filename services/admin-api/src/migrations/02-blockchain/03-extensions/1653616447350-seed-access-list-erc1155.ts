import { MigrationInterface, QueryRunner } from "typeorm";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedAccessListErc1155At1653616447350 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc1155ContractBlacklistAddress = process.env.ERC1155_BLACKLIST_ADDR;

    await queryRunner.query(`
      INSERT INTO ${ns}.access_list (
        address,
        account,
        allowance,
        created_at,
        updated_at
      ) VALUES (
        '${erc1155ContractBlacklistAddress}',
        '${wallets[0]}',
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc1155ContractBlacklistAddress}',
        '${wallets[1]}',
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc1155ContractBlacklistAddress}',
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
