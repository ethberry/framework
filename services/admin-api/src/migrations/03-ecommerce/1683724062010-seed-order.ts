import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedOrder1683724062010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.order (
        order_status,
        address_id,
        merchant_id,
        user_id,
        is_archived,
        created_at,
        updated_at
      ) VALUES (
        'NEW',
        1,
        1,
        1,
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'SCHEDULED',
        1,
        1,
        2,
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'NOW_IN_DELIVERY',
        1,
        1,
        3,
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'CLOSED',
        1,
        1,
        1,
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'CLOSED',
        1,
        1,
        1,
        true,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'CLOSED',
        2,
        2,
        3,
        false,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'CLOSED',
        2,
        2,
        3,
        true,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.order RESTART IDENTITY CASCADE;`);
  }
}
