import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

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
        1306,
        130601, -- sword
        1,
        40100101
      ), (
        'ERC721',
        1306,
        130602, -- mace
        1,
        40100102
      ), (
        'ERC721',
        1306,
        130602, -- axe
        1,
        40100103
      ), (
        'ERC1155',
        1501,
        150102, -- wood
        1,
        40100104
      ), (
        'ERC1155',
        1501,
        150103, -- iron
        10,
        40100105
      ), (
        'ERC20',
        1201,
        120101, -- space credits
        '${constants.WeiPerEther.toString()}',
        40100106
      ), (
        'ERC20',
        1201,
        120101, -- space credits
        '${constants.WeiPerEther.toString()}',
        40100107
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
