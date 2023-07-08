import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";

export class SeedEventHistoryErc721LendComponentsAt1678931845540 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
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
        1303010,
        'ITEM',
        10309,
        103090101,
        1
      ), (
        1303010,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        1303020,
        'ITEM',
        10309,
        103090201,
        1
      ), (
        1303020,
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
