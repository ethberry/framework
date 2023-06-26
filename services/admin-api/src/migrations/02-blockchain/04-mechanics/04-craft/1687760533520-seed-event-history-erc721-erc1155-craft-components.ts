import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedEventHistoryErc721Erc1155CraftComponentsAt1687760533520 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component_history (
        history_id,
        exchange_type,
        contract_id,
        token_id,
        amount
      ) VALUES (
        10435010,
        'ITEM',
        10306,
        103060101,
        1
      ), (
        10435010,
        'PRICE',
        10501,
        105010201,
        1
      ), (
        10435010,
        'PRICE',
        10501,
        105010301,
        1
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
