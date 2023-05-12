import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedOrder1683724062010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.order (
        order_status,
        address_id,
        merchant_id,
        user_id,
        created_at,
        updated_at
      ) VALUES (
        'NEW',
        1,
        1,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'SCHEDULED',
        1,
        1,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'NOW_IN_DELIVERY',
        1,
        1,
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'CLOSED',
        1,
        2,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'CLOSED',
        1,
        2,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'CLOSED',
        2,
        1,
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'CLOSED',
        2,
        2,
        3,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.order RESTART IDENTITY CASCADE;`);
  }
}
