import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";

export class SeedEventHistoryErc721PurchaseComponentsAt1563804040240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component_history (
        history_id,
        exchange_type,
        contract_id,
        token_id,
        amount
      ) VALUES (
        1301010,
        'ITEM',
        1301,
        13010101,
        1
      ), (
        1301010,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1301020,
        'ITEM',
        1301,
        13010102,
        1
      ), (
        1301020,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1301030,
        'ITEM',
        1301,
        13010103,
        1
      ), (
        1301030,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1301040,
        'ITEM',
        1301,
        13010104,
        1
      ), (
        1301040,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1301050,
        'ITEM',
        1301,
        13010105,
        1
      ), (
        1301050,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1301060,
        'ITEM',
        1301,
        13010106,
        1
      ), (
        1301060,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1301070,
        'ITEM',
        1301,
        13010107,
        1
      ), (
        1301070,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1301080,
        'ITEM',
        1301,
        13010108,
        1
      ), (
        1301080,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1301090,
        'ITEM',
        1301,
        13010109,
        1
      ), (
        1301090,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        1301100,
        'ITEM',
        1301,
        13010110,
        1
      ), (
        1301100,
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
