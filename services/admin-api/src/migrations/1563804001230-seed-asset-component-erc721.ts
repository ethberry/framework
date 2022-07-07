import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";

export class SeedAssetComponents1563804001230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        token_id,
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
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_rules`);
  }
}
