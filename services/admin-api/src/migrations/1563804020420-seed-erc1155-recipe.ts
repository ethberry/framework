import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedErc1155Recipe1563804020420 implements MigrationInterface {
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
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        6,
        'INACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc1155_recipe RESTART IDENTITY CASCADE;`);
  }
}
