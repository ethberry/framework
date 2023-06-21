import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";

export class SeedAssetComponentsAchievementAt1681273013045 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        10306,
        1030601, -- sword
        1,
        40100101
      ), (
        'ERC721',
        10306,
        1030602, -- mace
        1,
        40100102
      ), (
        'ERC721',
        10306,
        1030602, -- axe
        1,
        40100103
      ), (
        'ERC1155',
        10501,
        1050102, -- wood
        1,
        40100104
      ), (
        'ERC1155',
        10501,
        1050103, -- iron
        10,
        40100105
      ), (
        'ERC20',
        10201,
        1020101, -- Space Creditss
        '${WeiPerEther.toString()}',
        40100106
      ), (
        'ERC20',
        10201,
        1020101, -- Space Creditss
        '${WeiPerEther.toString()}',
        40100107
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
