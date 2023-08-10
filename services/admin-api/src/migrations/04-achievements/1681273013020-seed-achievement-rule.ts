import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedAchievementRule1681273013020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

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
        achievement_type,
        event_type,
        contract_id,
        item_id,
        achievement_status,
        created_at,
        updated_at
      ) VALUES (
        1,
        'Marketplace',
        '${simpleFormatting}',
        'MARKETPLACE',
        'Purchase',
         102,
         50100101,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        'Craft',
        '${simpleFormatting}',
        'CRAFT',
        'Craft',
        10306,
        50100102,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        'Collection',
        '${simpleFormatting}',
        'COLLECTION',
        'CollectionDeployed',
        null,
        50100103,
        'INACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        'Ecommerce',
        '${simpleFormatting}',
        'ECOMMERCE',
        null,
        null,
        50100104,
        'INACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.achievement_rule RESTART IDENTITY CASCADE;`);
  }
}
