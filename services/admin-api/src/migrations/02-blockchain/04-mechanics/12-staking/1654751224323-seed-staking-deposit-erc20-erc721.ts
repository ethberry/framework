import { MigrationInterface, QueryRunner } from "typeorm";
import { addDays } from "date-fns";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedStakingDepositErc20Erc721At1654751224323 implements MigrationInterface {
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
        2301,
        '${currentDateTime}',
        '${endDateTime}',
        23, -- ERC20 > ERC721
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'CANCELED',
        2302,
        '${currentDateTime}',
        '${endDateTime}',
        23, -- ERC20 > ERC721
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'COMPLETE',
        2303,
        '${currentDateTime}',
        '${endDateTime}',
        23, -- ERC20 > ERC721
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        2304,
        '${currentDateTime}',
        '${endDateTime}',
        23, -- ERC20 > ERC721
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        2305,
        '${currentDateTime}',
        '${endDateTime}',
        23, -- ERC20 > ERC721
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
