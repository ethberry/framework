import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedCraftErc1155Erc721RecipesAt1653616448530 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102530101
      ), (
        102530102
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
        'ERC1155',
        10501,
        1050102, -- wood
        10,
        102530101
      ), (
        'ERC1155',
        10501,
        1050103, -- iron
        10,
        102530101
      ), (
        'ERC721',
        10306,
        1030601, -- sword
        1,
        102530102
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.craft (
        id,
        item_id,
        price_id,
        inverse,
        craft_status,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        1050301,
        102530101,
        102530102,
        true,
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
