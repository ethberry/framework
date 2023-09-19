import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedEventHistoryErc998ClaimComponentsAt1653616447945 implements MigrationInterface {
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
        10402010,
        'ITEM',
        10401,
        104010101,
        1
      ), (
        10402020,
        'ITEM',
        10406,
        104060101,
        1
      ), (
        10402030,
        'ITEM',
        10401,
        104010101,
        1
      ), (
        10402030,
        'ITEM',
        10406,
        104060101,
        1
      ), (
        10402040,
        'ITEM',
        10401,
        104010101,
        1
      ), (
        10402040,
        'ITEM',
        10406,
        104060101,
        1
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
