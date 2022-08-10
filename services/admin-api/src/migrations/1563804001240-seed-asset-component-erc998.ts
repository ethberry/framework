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
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        14101
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        14102
      ), (
        'ERC20',
        21,
        12001, -- space credit
        '${constants.WeiPerEther.toString()}',
        14103
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
