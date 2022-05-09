import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedErc1155Recipe1645160381130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.erc1155_recipe (
        erc1155_token_id,
        recipe_status,
        created_at,
        updated_at
      ) VALUES (
        4,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc1155_recipe RESTART IDENTITY CASCADE;`);
  }
}
