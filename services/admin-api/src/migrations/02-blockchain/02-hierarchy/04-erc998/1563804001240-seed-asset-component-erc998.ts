import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";

export class SeedAssetComponentsErc998At1563804001240 implements MigrationInterface {
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
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        140501
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        140502
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        140601
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        140602
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        140603
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        140701
      ), (
        'ERC20',
        2217,
        221701, -- space credit
        '${constants.WeiPerEther.toString()}',
        240101
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
