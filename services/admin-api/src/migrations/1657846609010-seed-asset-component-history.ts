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
        301001,
        'ITEM',
        301,
        301001,
        1
      ), (
        301001,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        301002,
        'ITEM',
        301,
        301002,
        1
      ), (
        301002,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        301003,
        'ITEM',
        301,
        301003,
        1
      ), (
        301003,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        305001,
        'ITEM',
        305,
        305001,
        1
      ), (
        305001,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        305002,
        'ITEM',
        305,
        305002,
        1
      ), (
        305002,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        305003,
        'ITEM',
        305,
        305003,
        1
      ), (
        305003,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        305004,
        'ITEM',
        305,
        305004,
        1
      ), (
        305004,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        305005,
        'ITEM',
        305,
        305005,
        1
      ), (
        305005,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        305006,
        'ITEM',
        305,
        305006,
        1
      ), (
        305006,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        305007,
        'ITEM',
        305,
        305007,
        1
      ), (
        305007,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        305008,
        'ITEM',
        305,
        305008,
        1
      ), (
        305008,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        306001,
        'ITEM',
        306,
        306001,
        1
      ), (
        306001,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        306002,
        'ITEM',
        306,
        306002,
        1
      ), (
        306002,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        306003,
        'ITEM',
        306,
        306003,
        1
      ), (
        306003,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        306004,
        'ITEM',
        306,
        306004,
        1
      ), (
        306004,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      );
    `);

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
        406,
        406001,
        1
      ), (
        406001,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        406002,
        'ITEM',
        406,
        406002,
        1
      ), (
        406002,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        406003,
        'ITEM',
        406,
        406003,
        1
      ), (
        406003,
        'PRICE',
        201,
        201001,
        '${constants.WeiPerEther.toString()}'
      ), (
        406004,
        'ITEM',
        406,
        406004,
        1
      ), (
        406004,
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
