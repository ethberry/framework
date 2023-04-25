import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedAchievementRule1681273013020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.achievement_rule (
        title,
        description,
        achievement_type,
        created_at,
        updated_at
      ) VALUES (
        'Marketplace',
        '${simpleFormatting}',
        'MARKETPLACE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Craft',
        '${simpleFormatting}',
        'CRAFT',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Collection',
        '${simpleFormatting}',
        'COLLECTION',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Ecommerce',
        '${simpleFormatting}',
        'ECOMMERCE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.achievement_rule RESTART IDENTITY CASCADE;`);
  }
}
