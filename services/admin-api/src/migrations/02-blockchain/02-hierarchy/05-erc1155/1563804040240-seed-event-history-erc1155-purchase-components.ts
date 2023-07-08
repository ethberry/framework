import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";

export class SeedEventHistoryErc1155PurchaseComponentsAt1563804040240 implements MigrationInterface {
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
        10501010,
        'ITEM',
        10501,
        105010101,
        1000
      ), (
        10501010,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        10501020,
        'ITEM',
        10501,
        105010201,
        1000
      ), (
        10501020,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        10501030,
        'ITEM',
        10504,
        105040101,
        1000
      ), (
        10501030,
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
