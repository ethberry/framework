import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedAchievementItem1681273013060 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.achievement_item (
        user_id,
        achievement_rule_id,
        history_id,
        created_at,
        updated_at
      ) VALUES (
        1,
        1,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1,
        1301020,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1,
        1301030,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        1,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        2,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        2,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        2,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        2,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        2,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        2,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        3,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        3,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        3,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        3,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        3,
        1301010,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.achievement_item RESTART IDENTITY CASCADE;`);
  }
}
