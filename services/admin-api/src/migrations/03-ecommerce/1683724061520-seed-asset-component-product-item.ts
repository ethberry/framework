import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedAssetComponentProductItemAt1683724061520 implements MigrationInterface {
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
        1020101, -- Space Creditss
        '${WeiPerEther.toString()}',
        190101
      ), (
        'ERC20',
        10201,
        1020101, -- Space Creditss
        '${WeiPerEther.toString()}',
        190102
      ), (
        'ERC20',
        10201,
        1020101, -- Space Creditss
        '${WeiPerEther.toString()}',
        190103
      ), (
        'ERC20',
        10201,
        1020101, -- Space Creditss
        '${WeiPerEther.toString()}',
        190104
      ), (
        'ERC20',
        10201,
        1020101, -- Space Creditss
        '${WeiPerEther.toString()}',
        190105
      ), (
        'ERC20',
        10201,
        1020101, -- Space Creditss
        '${WeiPerEther.toString()}',
        190106
      ), (
        'ERC20',
        10201,
        1020101, -- Space Creditss
        '${WeiPerEther.toString()}',
        190107
      ), (
        'ERC20',
        10201,
        1020101, -- Space Creditss
        '${WeiPerEther.toString()}',
        190108
      ), (
        'ERC20',
        10201,
        1020101, -- Space Creditss
        '${WeiPerEther.toString()}',
        190109
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
