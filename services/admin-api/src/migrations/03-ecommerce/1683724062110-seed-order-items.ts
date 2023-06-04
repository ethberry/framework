import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedOrderItems1683724062110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    // @TODO fix to seed order items correctly with asset-component-history
    await queryRunner.query(`
      INSERT INTO ${ns}.order_item (
        order_id,
        product_id,
        amount,
        created_at,
        updated_at
      ) VALUES (
        1,
        1,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1,
        2,
        10,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        1,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        2,
        5,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        1,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        2,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        3,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        1,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        2,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        3,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        4,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        5,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        6,
        1,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        6,
        4,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        7,
        5,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        7,
        2,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        7,
        3,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        7,
        5,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.order_item RESTART IDENTITY CASCADE;`);
  }
}
