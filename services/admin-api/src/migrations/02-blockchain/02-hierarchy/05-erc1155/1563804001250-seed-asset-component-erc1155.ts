import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";

export class SeedAssetComponentsErc1155At1563804001250 implements MigrationInterface {
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
        150101
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        150102
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        150103
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        150104
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        150105
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        150401
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        150402
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${constants.WeiPerEther.toString()}',
        150403
      ), (
        'ERC20',
        2207,
        220701, -- space credit
        '${constants.WeiPerEther.toString()}',
        250101
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
