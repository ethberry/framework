import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedAchievementLevel1681273013040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.achievement_level (
        title,
        description,
        achievement_rule_id,
        amount,
        created_at,
        updated_at
      ) VALUES (
        'Rookie',
        '${simpleFormatting}',
        1,
        10,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Veteran',
        '${simpleFormatting}',
        1,
        100,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Pro',
        '${simpleFormatting}',
        1,
        1000,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Craftsman',
        '${simpleFormatting}',
        2,
        10,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Artisan',
        '${simpleFormatting}',
        2,
        100,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Collector',
        '${simpleFormatting}',
        3,
        10,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Commersant',
        '${simpleFormatting}',
        4,
        10,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.achievement_level RESTART IDENTITY CASCADE;`);
  }
}
