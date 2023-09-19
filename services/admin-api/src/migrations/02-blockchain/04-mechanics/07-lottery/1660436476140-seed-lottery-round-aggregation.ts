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
        102230101
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230102
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230103
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230104
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230105
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230106
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230201
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230202
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230203
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230204
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230205
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
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
        101,
        101,
        1,
        42,
        102230101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102,
        101,
        2,
        42,
        102230102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        103,
        101,
        3,
        42,
        102230103,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        104,
        101,
        4,
        42,
        102230104,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        105,
        101,
        5,
        42,
        102230105,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        106,
        101,
        6,
        420,
        102230106,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        201,
        102,
        1,
        42,
        102230201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        202,
        102,
        2,
        42,
        102230202,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        203,
        102,
        3,
        42,
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
        42,
        102230205,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        206,
        102,
        6,
        4200,
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
