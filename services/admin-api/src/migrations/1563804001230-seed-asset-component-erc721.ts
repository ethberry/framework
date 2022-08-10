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
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        13101
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        13102
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        13103
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        13501
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        13502
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        13503
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        13504
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        13505
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        13506
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        13507
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        13508
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        13601
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        13602
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        13603
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
