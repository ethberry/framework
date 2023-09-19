import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedEventHistoryMysteryMixedPurchaseComponentsAt1687580606620 implements MigrationInterface {
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
        102110210,
        'ITEM',
        11106,
        111060101,
        1
      ), (
        102110210,
        'ITEM',
        10201,
        102010101,
        '${WeiPerEther.toString()}'
      ), (
        102110210,
        'ITEM',
        10301,
        103010101,
        1
      ), (
        102110210,
        'ITEM',
        10401,
        104010101,
        1
      ), (
        102110210,
        'ITEM',
        10501,
        105010101,
        1000
      ), (
        102110210,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
