import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedClaimTemplateMysteryEventHistoryComponentsAt1653616447935 implements MigrationInterface {
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
        103021110,
        'ITEM',
        11101,
        111010101,
        1
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
