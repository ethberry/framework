import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedStock1683724062510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.stock (
        product_item_id,
        total_stock_quantity,
        reserved_stock_quantity,
        created_at,
        updated_at
      ) VALUES (
        1,
        100,
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        1000,
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        1000,
        20,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        1000,
        0,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        1000,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        6,
        1000,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        7,
        1000,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        8,
        1000,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        9,
        1000,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.stock RESTART IDENTITY CASCADE;`);
  }
}
