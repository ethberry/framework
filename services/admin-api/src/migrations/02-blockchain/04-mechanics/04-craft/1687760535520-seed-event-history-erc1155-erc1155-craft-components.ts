import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedEventHistoryErc1155Erc1155CraftComponentsAt1687760535520 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
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
        10455010,
        'ITEM',
        10501,
        105010201,
        10
      ), (
        10455010,
        'PRICE',
        10501,
        105010401,
        1
      ), (
        10455020,
        'ITEM',
        10501,
        105010301,
        10
      ), (
        10455020,
        'PRICE',
        10501,
        105010401,
        1
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
