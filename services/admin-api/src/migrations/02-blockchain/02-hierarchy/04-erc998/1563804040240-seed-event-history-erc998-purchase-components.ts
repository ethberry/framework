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
        10401010,
        'ITEM',
        10401,
        104010101,
        1
      ), (
        10401010,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        10401020,
        'ITEM',
        10401,
        104010201,
        1
      ), (
        10401020,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        10401030,
        'ITEM',
        10401,
        104010301,
        1
      ), (
        10401030,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        10404010,
        'ITEM',
        10404,
        104040101,
        1
      ), (
        10404010,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        10404020,
        'ITEM',
        10404,
        104040201,
        1
      ), (
        10404020,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        10404030,
        'ITEM',
        10404,
        104040301,
        1
      ), (
        10404030,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        10404040,
        'ITEM',
        10404,
        104040401,
        1
      ), (
        10404040,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        10404050,
        'ITEM',
        10404,
        104040501,
        1
      ), (
        10404050,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        10405010,
        'ITEM',
        10405,
        104050101,
        1
      ), (
        10405010,
        'PRICE',
        10201,
        102010101, -- Space Credits
        '${WeiPerEther.toString()}'
      ), (
        10405020,
        'ITEM',
        10405,
        104050102,
        1
      ), (
        10405020,
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
