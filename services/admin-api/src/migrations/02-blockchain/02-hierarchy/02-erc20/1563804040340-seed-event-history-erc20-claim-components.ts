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
        1202010,
        'ITEM',
        1301,
        13010101,
        1
      ), (
        1202020,
        'ITEM',
        1301,
        13010101,
        1
      ), (
        1202030,
        'ITEM',
        1301,
        13010101,
        1
      ), (
        1202040,
        'ITEM',
        1301,
        13010101,
        1
      ), (
        1202050,
        'ITEM',
        1301,
        13010101,
        1
      ), (
        1202060,
        'ITEM',
        1301,
        13010101,
        1
      ), (
        1202070,
        'ITEM',
        1301,
        13010101,
        1
      ), (
        1202080,
        'ITEM',
        1301,
        13010101,
        1
      ), (
        1202090,
        'ITEM',
        1301,
        13010101,
        1
      ), (
        1202100,
        'ITEM',
        1301,
        13010101,
        1
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
