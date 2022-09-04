import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { ns } from "@framework/constants";

export class SeedAssetComponentGrade1657846587020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'NATIVE',
        101,
        101001, -- ETH
        '${constants.WeiPerEther.toString()}',
        50101
      ), (
        'ERC20',
        201,
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        50102
      ), (
        'ERC1155',
        501,
        501001, -- gold
        '1000',
        50201
      ), (
        'ERC1155',
        501,
        501001, -- gold
        '1000',
        50202
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component RESTART IDENTITY CASCADE;`);
  }
}
