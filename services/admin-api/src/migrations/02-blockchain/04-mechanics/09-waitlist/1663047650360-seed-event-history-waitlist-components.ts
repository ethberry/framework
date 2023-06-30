import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";

export class SeedEventHistoryWaitListComponentsAt1663047650360 implements MigrationInterface {
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
        1700001,
        'ITEM',
        10101,
        101010101, -- BESU
        '${WeiPerEther.toString()}'
      ), (
        1700002,
        'ITEM',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        1700003,
        'ITEM',
        10301,
        103010101,
        '${WeiPerEther.toString()}'
      ), (
        1700004,
        'ITEM',
        10401,
        104010101,
        '${WeiPerEther.toString()}'
      ), (
        1700005,
        'ITEM',
        10501,
        105010101,
        '${WeiPerEther.toString()}'
      ), (
        1700006,
        'ITEM',
        10101,
        101010101, -- BESU
        '${WeiPerEther.toString()}'
      ), (
        1700006,
        'ITEM',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        1700006,
        'ITEM',
        10301,
        103010101,
        '${WeiPerEther.toString()}'
      ), (
        1700006,
        'ITEM',
        10401,
        104010101,
        '${WeiPerEther.toString()}'
      ), (
        1700006,
        'ITEM',
        10501,
        105010101,
        '${WeiPerEther.toString()}'
      ), (
        1700007,
        'ITEM',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        1700008,
        'ITEM',
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
