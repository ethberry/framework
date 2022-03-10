import { MigrationInterface, QueryRunner } from "typeorm";

import { rawStateString } from "@gemunion/draft-js-utils";
import { ns } from "@gemunion/framework-constants";

export class SeedCategory1593408358860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.category (
        title,
        description,
        parent_id,
        created_at,
        updated_at
      ) VALUES (
        'Root',
        '${rawStateString}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'First',
        '${rawStateString}',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Second',
        '${rawStateString}',
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
