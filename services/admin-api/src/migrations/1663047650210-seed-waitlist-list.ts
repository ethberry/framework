import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedWaitlistListAt1663047650210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.waitlist_list (
        title,
        description,
        created_at,
        updated_at
      ) VALUES (
        'Waitlist #1',
        '${simpleFormatting}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Waitlist #2',
        '${simpleFormatting}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.waitlist_list`);
  }
}
