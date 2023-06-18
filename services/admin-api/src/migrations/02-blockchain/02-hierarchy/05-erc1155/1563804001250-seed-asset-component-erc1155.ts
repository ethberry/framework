import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

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
        10201,
        1020101, -- space credit
        '${WeiPerEther.toString()}',
        101050101
      ), (
        'ERC20',
        10201,
        1020101, -- space credit
        '${WeiPerEther.toString()}',
        101050102
      ), (
        'ERC20',
        10201,
        1020101, -- space credit
        '${WeiPerEther.toString()}',
        101050103
      ), (
        'ERC20',
        10201,
        1020101, -- space credit
        '${WeiPerEther.toString()}',
        101050104
      ), (
        'ERC20',
        10201,
        1020101, -- space credit
        '${WeiPerEther.toString()}',
        101050105
      ), (
        'ERC20',
        10201,
        1020101, -- space credit
        '${WeiPerEther.toString()}',
        101050401
      ), (
        'ERC20',
        10201,
        1020101, -- space credit
        '${WeiPerEther.toString()}',
        101050402
      ), (
        'ERC20',
        10201,
        1020101, -- space credit
        '${WeiPerEther.toString()}',
        101050403
      ), (
        'ERC20',
        20217,
        2021701, -- busd
        '${WeiPerEther.toString()}',
        201050101
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
