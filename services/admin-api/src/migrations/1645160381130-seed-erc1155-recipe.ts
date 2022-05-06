import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedErc1155Recipe1645160381130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.erc1155_recipe (
        title,
        description,
        erc1155_token_id,
        recipe_status,
        created_at,
        updated_at
      ) VALUES (
        'Iron ingot',
        '${simpleFormatting}',
        4,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Wood log',
        '${simpleFormatting}',
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
