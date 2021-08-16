import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@gemunion/framework-constants-misc";

export class SetupOrders1593490663240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.order (
        user_id,
        order_status,
        merchant_id,
        product_id,
        price,
        created_at,
        updated_at
      ) VALUES (
        4,
        'NEW',
        1,
        1,
        125,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        'NEW',
        1,
        2,
        125,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        'NEW',
        1,
        3,
        100,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        'NEW',
        1,
        1,
        100,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        'CLOSED',
        1,
        1,
        100,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        'CLOSED',
        2,
        3,
        100,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        'CANCELED',
        2,
        3,
        100,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.order RESTART IDENTITY CASCADE;`);
  }
}
