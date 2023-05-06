import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";

export class SeedAssetComponentsProductAt1593408358915 implements MigrationInterface {
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
        120101, -- space credits
        '${WeiPerEther.toString()}',
        190101
      ), (
        'ERC20',
        1201,
        120101, -- space credits
        '${WeiPerEther.toString()}',
        190102
      ), (
        'ERC20',
        1201,
        120101, -- space credits
        '${WeiPerEther.toString()}',
        190103
      ), (
        'ERC20',
        1201,
        120101, -- space credits
        '${WeiPerEther.toString()}',
        190104
      ), (
        'ERC20',
        1201,
        120101, -- space credits
        '${WeiPerEther.toString()}',
        190105
      ), (
        'ERC20',
        1201,
        120101, -- space credits
        '${WeiPerEther.toString()}',
        190106
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
