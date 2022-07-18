import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";

export class SeedAssetComponentsErc721At1563804001230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20101
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20102
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20103
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20201
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20202
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20203
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20204
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20205
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20206
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20207
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20208
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20301
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20302
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20303
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20401
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20402
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        20403
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
