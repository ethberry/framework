import { MigrationInterface, QueryRunner } from "typeorm";
import { addDays } from "date-fns";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedStakingDepositErc998Erc1155At1654751224345 implements MigrationInterface {
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
        4501,
        '${currentDateTime}',
        '${endDateTime}',
        45, -- ERC998 > ERC1155
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'CANCELED',
        4502,
        '${currentDateTime}',
        '${endDateTime}',
        45, -- ERC998 > ERC1155
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'COMPLETE',
        4503,
        '${currentDateTime}',
        '${endDateTime}',
        45, -- ERC998 > ERC1155
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        4504,
        '${currentDateTime}',
        '${endDateTime}',
        45, -- ERC998 > ERC1155
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        4505,
        '${currentDateTime}',
        '${addDays(new Date(), 1).toISOString()}',
        45, -- ERC998 > ERC1155
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
