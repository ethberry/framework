import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedEventHistoryMysteryMixedUnpackComponentsAt1687580606640 implements MigrationInterface {
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
        102120210,
        'ITEM',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        102120210,
        'ITEM',
        10306,
        103060101,
        1
      ), (
        102120210,
        'ITEM',
        10406,
        104060101,
        1
      ), (
        102120210,
        'ITEM',
        10501,
        105010101,
        1
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
