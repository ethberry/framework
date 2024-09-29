import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { NodeEnv } from "@ethberry/constants";

export class SeedClaimTokenErc20EventHistoryComponentsAt1653616447925 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
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
        102020110,
        'ITEM',
        10201,
        102010101,
        '${WeiPerEther.toString()}'
      ), (
        102020210,
        'ITEM',
        10204,
        102040101,
        '${WeiPerEther.toString()}'
      ), (
        102020310,
        'ITEM',
        10280,
        102800101,
        '${WeiPerEther.toString()}'
      ), (
        102020410,
        'ITEM',
        20201,
        202010101,
        '${WeiPerEther.toString()}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
