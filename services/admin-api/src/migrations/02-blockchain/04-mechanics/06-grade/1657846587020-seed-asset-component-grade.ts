import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedAssetComponentGrade1657846587020 implements MigrationInterface {
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
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        102000301
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102000302
      ), (
        'ERC1155',
        10280,
        1028001, -- Warp Credits
        '${WeiPerEther.toString()}',
        102000308
      ), (
        'NATIVE',
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        102000401
      ), (
        'ERC20',
        10201, -- Space Credits
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102000402
      ), (
        'ERC1155',
        10280,
        1028001, -- Warp Credits
        '${WeiPerEther.toString()}',
        102000308
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component RESTART IDENTITY CASCADE;`);
  }
}
