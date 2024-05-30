import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedAssetComponentsLootboxAt1563804001260 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230101
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230102
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230401
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230501
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102230601
      ), (
        'ERC20',
        10280,
        1028001, -- Warp Credits
        '${WeiPerEther.toString()}',
        102230801
      ), (
        'ERC20',
        10280,
        1028001, -- Warp Credits
        '${WeiPerEther.toString()}',
        102230801
      ), (
        'ERC20',
        20201,
        2020101, -- BEP Credits
        '${WeiPerEther.toString()}',
        202230101
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
