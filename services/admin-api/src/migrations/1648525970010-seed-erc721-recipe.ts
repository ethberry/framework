import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedErc721Recipe1648525970010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.erc721_recipe (
        erc721_template_id,
        erc721_dropbox_id,
        recipe_status,
        created_at,
        updated_at
      ) VALUES (
        1,
        1,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        null,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc721_recipe RESTART IDENTITY CASCADE;`);
  }
}
