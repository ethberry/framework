import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedAchievementRule1681273013020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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
        'Marketplace',
        '${simpleFormatting}',
        'MARKETPLACE',
        'Purchase',
         402,
         50100101,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Craft',
        '${simpleFormatting}',
        'CRAFT',
        'Craft',
        1306,
        50100102,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
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
        'Ecommerce',
        '${simpleFormatting}',
        'ECOMMERCE',
        null,
        null,
        null,
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
