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
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        1501001
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        1501002
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        1501003
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        1501004
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        1501005
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        1504001
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        1504002
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        1504003
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        1511001
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
