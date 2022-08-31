import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";

export class SeedAssetComponentHistory1657846609010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component_history (
        history_id,
        exchange_type,
        contract_id,
        token_id,
        amount
      ) VALUES (
        1,
        'ITEM',
        301,
        301001,
        1
      ), (
        1,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        2,
        'ITEM',
        301,
        301002,
        1
      ), (
        2,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        3,
        'ITEM',
        301,
        301003,
        1
      ), (
        3,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
