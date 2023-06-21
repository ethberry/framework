import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedAchievementRedemption1681273013080 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.achievement_redemption (
        user_id,
        achievement_level_id,
        claim_id,
        created_at,
        updated_at
      ) VALUES (
        1,
        1,
        1040301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        4,
        1040302,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.achievement_item RESTART IDENTITY CASCADE;`);
  }
}
