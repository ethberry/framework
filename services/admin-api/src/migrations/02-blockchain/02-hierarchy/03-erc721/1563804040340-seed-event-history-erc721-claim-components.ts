import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedEventHistoryErc721ClaimComponentsAt1563804040340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component_history (
        history_id,
        exchange_type,
        contract_id,
        token_id,
        amount
      ) VALUES (
        1302010,
        'ITEM',
        1301,
        13010101,
        1
      ), (
        1302020,
        'ITEM',
        1301,
        13010102,
        1
      ), (
        1302030,
        'ITEM',
        1301,
        13010103,
        1
      ), (
        1302040,
        'ITEM',
        1301,
        13010104,
        1
      ), (
        1302050,
        'ITEM',
        1301,
        13010105,
        1
      ), (
        1302050,
        'ITEM',
        1301,
        13010101,
        1
      ), (
        1302060,
        'ITEM',
        1301,
        13010106,
        1
      ), (
        1302060,
        'ITEM',
        1301,
        13010101,
        1
      ), (
        1302070,
        'ITEM',
        1301,
        13010107,
        1
      ), (
        1302080,
        'ITEM',
        1301,
        13010108,
        1
      ), (
        1302080,
        'ITEM',
        1301,
        13010101,
        1
      ), (
        1302090,
        'ITEM',
        1301,
        13010109,
        1
      ), (
        1302100,
        'ITEM',
        1301,
        13010110,
        1
      ), (
        1302100,
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
