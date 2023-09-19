import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedEventHistoryMysteryErc721PurchaseComponentsAt1687580606320 implements MigrationInterface {
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
        102110110,
        'ITEM',
        11101,
        111010101,
        1
      ), (
        102110110,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        102110120,
        'ITEM',
        11101,
        111010102,
        1
      ), (
        102110120,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        102110130,
        'ITEM',
        11101,
        111010103,
        1
      ), (
        102110130,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        102110140,
        'ITEM',
        11101,
        111010104,
        1
      ), (
        102110140,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        102110150,
        'ITEM',
        11101,
        111010105,
        1
      ), (
        102110150,
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
