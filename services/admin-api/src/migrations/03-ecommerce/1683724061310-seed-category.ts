import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedCategory1683724061310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.category (
        title,
        description,
        parent_id,
        merchant_id,
        created_at,
        updated_at
      ) VALUES (
        'Root',
        '${simpleFormatting}',
        null,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'First',
        '${simpleFormatting}',
        1,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Second',
        '${simpleFormatting}',
        1,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.category RESTART IDENTITY CASCADE;`);
  }
}
