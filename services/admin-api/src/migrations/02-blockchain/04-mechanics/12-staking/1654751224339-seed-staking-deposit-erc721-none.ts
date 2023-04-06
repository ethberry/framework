import { MigrationInterface, QueryRunner } from "typeorm";
import { addDays, subDays } from "date-fns";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedStakingDepositErc721NoneAt1654751224339 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const now = new Date();
    const currentDateTime = now.toISOString();
    const endDateTime = addDays(now, 30).toISOString();

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
        3901,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        3902,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        3903,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'CANCELED',
        3904,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'COMPLETE',
        3905,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        3906,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        3907,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'CANCELED',
        3908,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        3909,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        3910,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        3911,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        3912,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        3913,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        3914,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        3915,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        3916,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        3917,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        3918,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        3919,
        '${currentDateTime}',
        '${endDateTime}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_deposit`);
  }
}
