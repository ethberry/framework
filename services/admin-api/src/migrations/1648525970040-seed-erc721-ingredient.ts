import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedErc721Ingredient1648525970040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.erc721_ingredient (
        erc721_recipe_id,
        erc1155_token_id,
        amount,
        created_at,
        updated_at
      ) VALUES (
        1,
        2,
        10,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        3,
        10,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc721_ingredient RESTART IDENTITY CASCADE;`);
  }
}
