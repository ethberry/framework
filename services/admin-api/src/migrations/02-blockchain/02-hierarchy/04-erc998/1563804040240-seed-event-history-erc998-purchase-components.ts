import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";

export class SeedEventHistoryErc998PurchaseComponentsAt1563804040240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component_history (
        history_id,
        exchange_type,
        contract_id,
        token_id,
        amount
      ) VALUES (
        1401010,
        'ITEM',
        10401,
        104010101,
        1
      ), (
        1401010,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        1401020,
        'ITEM',
        10401,
        104010201,
        1
      ), (
        1401020,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        1401030,
        'ITEM',
        10401,
        104010301,
        1
      ), (
        1401030,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        1404010,
        'ITEM',
        10404,
        104040101,
        1
      ), (
        1404010,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        1404020,
        'ITEM',
        10404,
        104040201,
        1
      ), (
        1404020,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        1404030,
        'ITEM',
        10404,
        104040301,
        1
      ), (
        1404030,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        1404040,
        'ITEM',
        10404,
        104040401,
        1
      ), (
        1404040,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        1404050,
        'ITEM',
        10404,
        104040501,
        1
      ), (
        1404050,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        1405010,
        'ITEM',
        10405,
        104050101,
        1
      ), (
        1405010,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        1405020,
        'ITEM',
        10405,
        104050102,
        1
      ), (
        1405020,
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
