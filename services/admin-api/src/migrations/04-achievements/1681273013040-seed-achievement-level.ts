import { MigrationInterface, QueryRunner } from "typeorm";
import { addDays } from "date-fns";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedAchievementLevel1681273013040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const now = new Date();
    const currentDateTime = now.toISOString();
    const defaultJSON = JSON.stringify({});

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
        id,
        title,
        description,
        achievement_rule_id,
        item_id,
        amount,
        parameters,
        achievement_level,
        start_timestamp,
        end_timestamp,
        created_at,
        updated_at
      ) VALUES (
        1,
        'Rookie',
        '${simpleFormatting}',
        1,
        40100101,
        5,
        '${defaultJSON}',
        1,
        '${currentDateTime}',
        '${addDays(now, 7).toISOString()}',                
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        'Veteran',
        '${simpleFormatting}',
        1,
        40100102,
        10,
        '${defaultJSON}',
        2,
        '${currentDateTime}',
        '${addDays(now, 7).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        'Pro',
        '${simpleFormatting}',
        1,
        40100103,
        15,
        '${defaultJSON}',
        3,
        '${currentDateTime}',
        '${addDays(now, 7).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        'Craftsman',
        '${simpleFormatting}',
        2,
        40100104,
        5,
        '${defaultJSON}',
        1,
        '${currentDateTime}',
        '${addDays(now, 7).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        'Artisan',
        '${simpleFormatting}',
        2,
        40100105,
        10,
        '${defaultJSON}',
        2,
        '${currentDateTime}',
        '${addDays(now, 7).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        6,
        'Collector',
        '${simpleFormatting}',
        3,
        40100106,
        5,
        '${defaultJSON}',
        1,
        '${currentDateTime}',
        '${addDays(now, 7).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        7,
        'Commersant',
        '${simpleFormatting}',
        4,
        40100107,
        10,
        '${defaultJSON}',
        1,
        '${currentDateTime}',
        '${addDays(now, 7).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.achievement_level RESTART IDENTITY CASCADE;`);
  }
}
