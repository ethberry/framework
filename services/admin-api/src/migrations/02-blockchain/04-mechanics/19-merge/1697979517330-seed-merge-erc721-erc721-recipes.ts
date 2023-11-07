import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedMergeErc721Erc721RecipesAt1697979517330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        10219330101
      ), (
        10219330102
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
        1030601, -- sword
        3,
        10219330101
      ), (
        'ERC721',
        10306,
        1030602, -- mace
        1,
        10219330102
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.merge (
        id,
        item_id,
        price_id,
        merge_status,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        1030501,
        10219330102,
        10219330101,
        'ACTIVE',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.merge RESTART IDENTITY CASCADE;`);
  }
}
