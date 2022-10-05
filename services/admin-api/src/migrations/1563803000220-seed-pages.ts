import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedPages1563803000220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.page (
        title,
        description,
        slug,
        page_status,
        created_at,
        updated_at
      ) VALUES (
        'About Us',
        '${simpleFormatting}',
        'about-us',
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Frequently Asked Questions',
        '${simpleFormatting}',
        'faq',
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.page RESTART IDENTITY CASCADE;`);
  }
}
