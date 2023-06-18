import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedEventHistoryErc20ClaimComponentsAt1563804040340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component_history (
        history_id,
        exchange_type,
        contract_id,
        token_id,
        amount
      ) VALUES (
        10202010,
        'ITEM',
        10301,
        103010101,
        1
      ), (
        10202020,
        'ITEM',
        10301,
        103010101,
        1
      ), (
        10202030,
        'ITEM',
        10301,
        103010101,
        1
      ), (
        10202040,
        'ITEM',
        10301,
        103010101,
        1
      ), (
        10202050,
        'ITEM',
        10301,
        103010101,
        1
      ), (
        10202060,
        'ITEM',
        10301,
        103010101,
        1
      ), (
        10202070,
        'ITEM',
        10301,
        103010101,
        1
      ), (
        10202080,
        'ITEM',
        10301,
        103010101,
        1
      ), (
        10202090,
        'ITEM',
        10301,
        103010101,
        1
      ), (
        10202100,
        'ITEM',
        10301,
        103010101,
        1
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
