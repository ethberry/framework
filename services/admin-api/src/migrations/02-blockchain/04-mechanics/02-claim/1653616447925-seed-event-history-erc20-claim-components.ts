import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedEventHistoryErc20ClaimComponentsAt1653616447925 implements MigrationInterface {
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
        10202010,
        'ITEM',
        10201,
        102010101,
        '${WeiPerEther.toString()}'
      ), (
        10202020,
        'ITEM',
        10201,
        102010101,
        '${WeiPerEther.toString()}'
      ), (
        10202030,
        'ITEM',
        10201,
        102010101,
        '${WeiPerEther.toString()}'
      ), (
        10202030,
        'ITEM',
        10201,
        102010101,
        '${WeiPerEther.toString()}'
      ), (
        10202040,
        'ITEM',
        10201,
        102010101,
        '${WeiPerEther.toString()}'
      ), (
        10202040,
        'ITEM',
        10201,
        102010101,
        '${WeiPerEther.toString()}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
