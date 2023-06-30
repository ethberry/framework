import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";

export class SeedEventHistoryErc721GradeComponentsAt1687481746320 implements MigrationInterface {
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
        10306010,
        'ITEM',
        10305,
        103050101,
        1
      ), (
        10306010,
        'PRICE',
        10101,
        101010101, -- BESU
        '${WeiPerEther.toString()}'
      ), (
        10306020,
        'ITEM',
        10305,
        103050201,
        1
      ), (
        10306020,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        10306030,
        'ITEM',
        10380,
        103800101,
        1
      ), (
        10306030,
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
