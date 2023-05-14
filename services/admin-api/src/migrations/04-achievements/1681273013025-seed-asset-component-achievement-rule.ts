import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedAssetComponentsAchievementRule1681273013025 implements MigrationInterface {
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
        50100101
      ), (
        'ERC721',
        1306,
        null, -- any weapon
        1,
        50100102
      ), (
        'ERC721',
        1306,
        130602, -- axe
        1,
        50100103
      ), (
        'ERC1155',
        1501,
        150102, -- wood
        1,
        50100104
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
