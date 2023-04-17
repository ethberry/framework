import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedAchievementLevel1681273013040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        40100101
      ), (
        40100102
      ), (
        40100103
      ), (
        40100104
      ), (
        40100105
      ), (
        40100106
      ), (
        40100107
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.achievement_level (
        title,
        description,
        achievement_rule_id,
        item_id,
        amount,
        created_at,
        updated_at
      ) VALUES (
        'Rookie',
        '${simpleFormatting}',
        1,
        40100101,
        5,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Veteran',
        '${simpleFormatting}',
        1,
        40100102,
        10,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Pro',
        '${simpleFormatting}',
        1,
        40100103,
        15,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Craftsman',
        '${simpleFormatting}',
        2,
        40100104,
        5,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Artisan',
        '${simpleFormatting}',
        2,
        40100105,
        10,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Collector',
        '${simpleFormatting}',
        3,
        40100106,
        10,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Commersant',
        '${simpleFormatting}',
        4,
        40100107,
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
