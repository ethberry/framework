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
        1301,
        13010101,
        1
      ), (
        301001,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        301002,
        'ITEM',
        1301,
        13010201,
        1
      ), (
        301002,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        301003,
        'ITEM',
        1301,
        13010301,
        1
      ), (
        301003,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        305001,
        'ITEM',
        1305,
        13050101, -- Chain mail
        1
      ), (
        305001,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        305002,
        'ITEM',
        1305,
        13050201, -- Helmet
        1
      ), (
        305002,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        305003,
        'ITEM',
        1305,
        13050301,
        1
      ), (
        305003,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        305004,
        'ITEM',
        1305,
        13050401,
        1
      ), (
        305004,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        305005,
        'ITEM',
        1305,
        13050501,
        1
      ), (
        305005,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        305006,
        'ITEM',
        1305,
        13050601,
        1
      ), (
        305006,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        305007,
        'ITEM',
        1305,
        13050701,
        1
      ), (
        305007,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        305008,
        'ITEM',
        1305,
        13050801,
        1
      ), (
        305008,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        306001,
        'ITEM',
        1306,
        13060101,
        1
      ), (
        306001,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        306002,
        'ITEM',
        1306,
        13060201,
        1
      ), (
        306002,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        306003,
        'ITEM',
        1306,
        13060301,
        1
      ), (
        306003,
        'PRICE',
        1201,
        12010101,
        '${constants.WeiPerEther.toString()}'
      ), (
        306004,
        'ITEM',
        1306,
        13060102,
        1
      ), (
        306004,
        'PRICE',
        1201,
        12010101,
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
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component_history RESTART IDENTITY CASCADE;`);
  }
}
