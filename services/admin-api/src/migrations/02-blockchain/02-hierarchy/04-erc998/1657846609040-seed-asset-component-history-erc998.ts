import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";

export class SeedAssetComponentHistoryErc998At1657846609040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component_history (
        history_id,
        exchange_type,
        contract_id,
        token_id,
        amount
      ) VALUES (
        406001,
        'ITEM',
        1406,
        14060101, -- hero
        1
      ), (
        406001,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        406002,
        'ITEM',
        1406,
        14060201,
        1
      ), (
        406002,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        406003,
        'ITEM',
        1406,
        14060301,
        1
      ), (
        406003,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        409001,
        'ITEM',
        1409,
        14090101,
        1
      ), (
        409001,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
