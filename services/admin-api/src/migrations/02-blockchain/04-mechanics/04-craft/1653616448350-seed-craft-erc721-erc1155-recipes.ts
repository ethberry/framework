import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@ethberry/constants";

export class SeedCraftErc721Erc1155RecipesAt1653616448350 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        10204350101
      ), (
        10204350102
      ), (
        10204350201
      ), (
        10204350202
      );
    `);

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
        1030601, -- Sword
        1,
        10204350101
      ), (
        'ERC1155',
        10501,
        1050102, -- wood
        10,
        10204350102
      ), (
        'ERC1155',
        10501,
        1050103, -- iron
        10,
        10204350102
      ), (
        'ERC721',
        10306,
        1030601, -- Sword
        1,
        10204350201
      ), (
        'ERC721',
        10306,
        1030602, -- mace
        1,
        10204350201
      ), (
        'ERC721',
        10306,
        1030603, -- axe
        1,
        10204350201
      ), (
        'ERC1155',
        10501,
        1050102, -- wood
        25,
        10204350202
      ), (
        'ERC1155',
        10501,
        1050103, -- iron
        25,
        10204350202
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.craft (
        id,
        item_id,
        price_id,
        craft_status,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        1030501,
        10204350101,
        10204350102,
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1030502,
        10204350201,
        10204350202,
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.craft RESTART IDENTITY CASCADE;`);
  }
}
