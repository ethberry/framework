import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

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
        1401,
        14010101,
        1
      ), (
        1401010,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1401020,
        'ITEM',
        1401,
        14010102,
        1
      ), (
        1401020,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1401030,
        'ITEM',
        1401,
        14010103,
        1
      ), (
        1401030,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1401040,
        'ITEM',
        1401,
        14010104,
        1
      ), (
        1401040,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1401050,
        'ITEM',
        1401,
        14010105,
        1
      ), (
        1401050,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1401060,
        'ITEM',
        1401,
        14010106,
        1
      ), (
        1401060,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1401070,
        'ITEM',
        1401,
        14010107,
        1
      ), (
        1401070,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1401080,
        'ITEM',
        1401,
        14010108,
        1
      ), (
        1401080,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1401090,
        'ITEM',
        1401,
        14010109,
        1
      ), (
        1401090,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1401100,
        'ITEM',
        1401,
        14010110,
        1
      ), (
        1401100,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
