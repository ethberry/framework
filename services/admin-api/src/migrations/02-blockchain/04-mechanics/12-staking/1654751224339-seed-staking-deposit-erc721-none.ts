import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";
import { wallets } from "@gemunion/constants";

export class SeedStakingDepositErc721NoneAt1654751224339 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const now = new Date();
    const currentDateTime = now.toISOString();

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
        '${subDays(now, 9).toISOString()}',
        '${subDays(now, 9 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        3902,
        '${subDays(now, 9).toISOString()}',
        '${subDays(now, 9 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        3903,
        '${subDays(now, 8).toISOString()}',
        '${subDays(now, 8 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'CANCELED',
        3904,
        '${subDays(now, 7).toISOString()}',
        '${subDays(now, 7 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'COMPLETE',
        3905,
        '${subDays(now, 7).toISOString()}',
        '${subDays(now, 7 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        3906,
        '${subDays(now, 5).toISOString()}',
        '${subDays(now, 5 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        3907,
        '${subDays(now, 5).toISOString()}',
        '${subDays(now, 5 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'CANCELED',
        3908,
        '${subDays(now, 5).toISOString()}',
        '${subDays(now, 5 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        3909,
        '${subDays(now, 4).toISOString()}',
        '${subDays(now, 4 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        3910,
        '${subDays(now, 4).toISOString()}',
        '${subDays(now, 4 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        3911,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 3 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'COMPLETE',
        3912,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 3 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        3913,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 3 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        3914,
        '${subDays(now, 2).toISOString()}',
        '${subDays(now, 2 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        3915,
        '${subDays(now, 1).toISOString()}',
        '${subDays(now, 1 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'COMPLETE',
        3916,
        '${subDays(now, 1).toISOString()}',
        '${subDays(now, 1 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        'ACTIVE',
        3917,
        '${subDays(now, 0).toISOString()}',
        '${subDays(now, 0 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        'ACTIVE',
        3918,
        '${subDays(now, 0).toISOString()}',
        '${subDays(now, 0 - 7).toISOString()}',
        29, -- ERC721 > NONE
        1,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        'ACTIVE',
        3919,
        '${subDays(now, 0).toISOString()}',
        '${subDays(now, 0 - 7).toISOString()}',
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
