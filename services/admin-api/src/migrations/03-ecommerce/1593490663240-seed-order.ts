import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedOrders1593490663240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.order (
        user_id,
        order_status,
        merchant_id,
        address_id,
        price,
        price_correction,
        created_at,
        updated_at
      ) VALUES (
        3,
        'NEW',
        1,
        1,
        125,
        -25,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        'SCHEDULED',
        1,
        2,
        125,
        25,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        'NOW_IN_DELIVERY',
        1,
        3,
        100,
        0,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        'CLOSED',
        1,
        1,
        100,
        0,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        'CLOSED',
        1,
        1,
        100,
        0,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        'CLOSED',
        2,
        3,
        100,
        0,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        'CLOSED',
        2,
        3,
        100,
        0,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.order RESTART IDENTITY CASCADE;`);
  }
}
