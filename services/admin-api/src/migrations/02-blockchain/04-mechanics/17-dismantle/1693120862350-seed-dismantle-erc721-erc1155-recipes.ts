import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@ethberry/constants";

export class SeedDismantleErc721Erc155RecipesAt1693120862350 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        10217350101
      ), (
        10217350102
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
        10217350101
      ), (
        'ERC1155',
        10501,
        1050102, -- wood
        10,
        10217350102
      ), (
        'ERC1155',
        10501,
        1050103, -- iron
        10,
        10217350102
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
        1030503,
        10217350102,
        10217350101,
        200,
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
