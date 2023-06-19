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
        10306,
        1030601, -- sword
        1,
        50100101
      ), (
        'ERC721',
        10306,
        null, -- any weapon
        1,
        50100102
      ), (
        'ERC721',
        10306,
        1030602, -- axe
        1,
        50100103
      ), (
        'ERC1155',
        10501,
        1050102, -- wood
        1,
        50100104
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
