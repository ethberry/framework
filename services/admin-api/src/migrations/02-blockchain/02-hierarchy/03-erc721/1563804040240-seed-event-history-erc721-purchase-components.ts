import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

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
        '${WeiPerEther.toString()}'
      ), (
        1301020,
        'ITEM',
        1301,
        13010201,
        1
      ), (
        1301020,
        'PRICE',
        1201,
        12010101,
        '${WeiPerEther.toString()}'
      ), (
        1301030,
        'ITEM',
        1301,
        13010301,
        1
      ), (
        1301030,
        'PRICE',
        1201,
        12010101,
        '${WeiPerEther.toString()}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
