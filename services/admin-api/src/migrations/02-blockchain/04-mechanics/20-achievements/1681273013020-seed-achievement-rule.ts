import { MigrationInterface, QueryRunner } from "typeorm";
import { addDays } from "date-fns";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedAchievementRule1681273013020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        50100101
      ), (
        50100102
      ), (
        50100103
      ), (
        50100104
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.achievement_rule (
        id,
        title,
        description,
        event_type,
        contract_id,
        item_id,
        achievement_status,
        start_timestamp,
        end_timestamp,
        created_at,
        updated_at
      ) VALUES (
        1,
        'Marketplace',
        '${simpleFormatting}',
        'Purchase',
         102,
         50100101,
        'ACTIVE',
        '${currentDateTime}',
        '${addDays(now, 7).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        'Craft',
        '${simpleFormatting}',
        'Craft',
        10306,
        50100102,
        'ACTIVE',
        '${currentDateTime}',
        '${addDays(now, 7).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        'Collection',
        '${simpleFormatting}',
        'CollectionDeployed',
        null,
        50100103,
        'INACTIVE',
        '${currentDateTime}',
        '${addDays(now, 7).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        'Ecommerce',
        '${simpleFormatting}',
        null,
        null,
        50100104,
        'INACTIVE',
        '${currentDateTime}',
        '${addDays(now, 7).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.achievement_rule RESTART IDENTITY CASCADE;`);
  }
}
