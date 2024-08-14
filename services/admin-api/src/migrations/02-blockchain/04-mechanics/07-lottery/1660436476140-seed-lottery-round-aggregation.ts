import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedLotteryRoundAggregationAt1660436476140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102231100
      ),(
        102231101
      ), (
        102231102
      ), (
        102231103
      ), (
        102231104
      ), (
        102231105
      ), (
        102231106
      ), (
        102231200
      ), (
        102231201
      ), (
        102231202
      ), (
        102231203
      ), (
        102231204
      ), (
        102231205
      ), (
        102231206
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102231100
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '294000000000000000000',
        102231101
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '71400000000000000000',
        102231102
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '49700000000000000000',
        102231103
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '22400000000000000000',
        102231104
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '3500000000000000000',
        102231105
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '700000000000000000',
        102231106
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102231200
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '532000000000000000000',
        102231201
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '147700000000000000000',
        102231202
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '58800000000000000000',
        102231203
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '29400000000000000000',
        102231204
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '10500000000000000000',
        102231205
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '1400000000000000000',
        102231206
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.lottery_round_aggregation (
        id,
        round_id,
        match,
        tickets,
        price_id,
        created_at,
        updated_at
      ) VALUES (
        100,
        101,
        0,
        404,
        102231100,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        101,
        101,
        1,
        420,
        102231101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102,
        101,
        2,
        102,
        102231102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        103,
        101,
        3,
        71,
        102231103,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        104,
        101,
        4,
        32,
        102231104,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        105,
        101,
        5,
        5,
        102231105,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        106,
        101,
        6,
        1,
        102231106,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        200,
        102,
        0,
        301,
        102231200,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        201,
        102,
        1,
        760,
        102231201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        202,
        102,
        2,
        211,
        102231202,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        203,
        102,
        3,
        84,
        102231203,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        204,
        102,
        4,
        42,
        102231204,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        205,
        102,
        5,
        15,
        102231205,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        206,
        102,
        6,
        2,
        102231206,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.lottery_round_aggregation_id_seq', 50000, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.lottery_round_aggregation RESTART IDENTITY CASCADE;`);
  }
}
