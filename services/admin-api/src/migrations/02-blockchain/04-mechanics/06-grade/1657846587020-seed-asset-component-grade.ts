import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

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
        10101,
        1010101, -- ETH
        '${WeiPerEther.toString()}',
        50101
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        50102
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        '1000',
        50103
      ), (
        'ERC1155',
        10501,
        1050101, -- Gold
        '1000',
        50104
      ), (
        'ERC1155',
        10280,
        1028001, -- Gold
        '1000',
        50105
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.asset_component RESTART IDENTITY CASCADE;`);
  }
}
