import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

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
        102230100
      ),(
        102230101
      ), (
        102230102
      ), (
        102230103
      ), (
        102230104
      ), (
        102230105
      ), (
        102230106
      ), (
        102230200
      ), (
        102230201
      ), (
        102230202
      ), (
        102230203
      ), (
        102230204
      ), (
        102230205
      ), (
        102230206
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
        102230100
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '294000000000000000000',
        102230101
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '71400000000000000000',
        102230102
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '49700000000000000000',
        102230103
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '22400000000000000000',
        102230104
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '3500000000000000000',
        102230105
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '700000000000000000',
        102230106
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230200
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '532000000000000000000',
        102230201
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '147700000000000000000',
        102230202
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '58800000000000000000',
        102230203
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '29400000000000000000',
        102230204
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '10500000000000000000',
        102230205
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '1400000000000000000',
        102230206
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
        102230100,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        101,
        101,
        1,
        420,
        102230101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102,
        101,
        2,
        102,
        102230102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        103,
        101,
        3,
        71,
        102230103,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        104,
        101,
        4,
        32,
        102230104,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        105,
        101,
        5,
        5,
        102230105,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        106,
        101,
        6,
        1,
        102230106,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        200,
        102,
        0,
        301,
        102230200,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        201,
        102,
        1,
        760,
        102230201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        202,
        102,
        2,
        211,
        102230202,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        203,
        102,
        3,
        84,
        102230203,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        204,
        102,
        4,
        42,
        102230204,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        205,
        102,
        5,
        15,
        102230205,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        206,
        102,
        6,
        2,
        102230206,
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
