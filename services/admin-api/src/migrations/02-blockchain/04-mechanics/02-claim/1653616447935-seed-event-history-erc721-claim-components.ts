import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedEventHistoryErc721ClaimComponentsAt1653616447935 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
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
        10302010,
        'ITEM',
        10301,
        103010101,
        1
      ), (
        10302020,
        'ITEM',
        10306,
        103060101,
        1
      ), (
        10302030,
        'ITEM',
        10301,
        103010301,
        1
      ), (
        10302030,
        'ITEM',
        10306,
        103060101,
        1
      ), (
        10302040,
        'ITEM',
        10301,
        103010301,
        1
      ), (
        10302040,
        'ITEM',
        10306,
        103060101,
        1
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
