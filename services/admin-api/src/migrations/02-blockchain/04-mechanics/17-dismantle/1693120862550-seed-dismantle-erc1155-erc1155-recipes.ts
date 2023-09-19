import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedDismantleErc1155Erc155RecipesAt1693120862550 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102550301
      ), (
        102550302
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
        1050104, -- plank
        1,
        102550301
      ), (
        'ERC1155',
        10501,
        1050102, -- wood
        10,
        102550302
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.dismantle (
        id,
        item_id,
        price_id,
        rarity_multiplier,
        dismantle_strategy,
        dismantle_status,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        1050503,
        102550302,
        102550301,
        0,
        'EXPONENTIAL',
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.dismantle RESTART IDENTITY CASCADE;`);
  }
}
