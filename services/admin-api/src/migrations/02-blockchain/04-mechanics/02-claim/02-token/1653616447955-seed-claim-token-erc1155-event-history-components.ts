import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedClaimTokenErc1155EventHistoryComponentsAt1653616447955 implements MigrationInterface {
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
        105020100,
        'ITEM',
        10501,
        105010101,
        1000
      ), (
        105020200,
        'ITEM',
        10504,
        105040101,
        1000
      ), (
        105020200,
        'ITEM',
        10504,
        105040201,
        1000
      ), (
        105020200,
        'ITEM',
        10504,
        105040301,
        1000
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
