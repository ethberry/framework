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
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        40101
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        40102
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        40103
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        40104
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        40105
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        40201
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        40202
      ), (
        'ERC20',
        2,
        10002, -- space credit
        '${constants.WeiPerEther.toString()}',
        40203
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
