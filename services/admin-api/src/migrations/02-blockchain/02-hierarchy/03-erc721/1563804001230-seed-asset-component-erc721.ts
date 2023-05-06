import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

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
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130101
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130102
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130103
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130401
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130402
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130403
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130501
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130502
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130503
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130504
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130505
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130506
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130507
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130601
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130602
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130603
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130701
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130801
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${(WeiPerEther * 2n).toString()}',
        130801
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${(WeiPerEther * 2n).toString()}',
        130802
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${(WeiPerEther * 2n).toString()}',
        130803
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130901
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130902
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        130903
      ), (
        'ERC20',
        1201,
        120101, -- space credit
        '${WeiPerEther.toString()}',
        230101
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
