import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedEventHistoryErc998GradeComponentsAt1687481746420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component_history (
        history_id,
        exchange_type,
        contract_id,
        token_id,
        amount
      ) VALUES (
        10406010,
        'ITEM',
        10405,
        104050101, -- Grimoire #1
        1
      ), (
        10406010,
        'PRICE',
        10101,
        101010101, -- BESU
        '${WeiPerEther.toString()}'
      ), (
        10406020,
        'ITEM',
        10405,
        104050201, -- Foliant
        1
      ), (
        10406020,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        10406030,
        'ITEM',
        10480,
        104800101, -- Voldemort
        1
      ), (
        10406030,
        'PRICE',
        10280,
        102800101, -- Warp Credits
        '${WeiPerEther.toString()}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
