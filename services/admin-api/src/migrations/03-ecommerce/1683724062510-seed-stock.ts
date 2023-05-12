import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedStock1683724062510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.stock (
        product_item_id,
        total_stock_quantity,
        reserved_stock_quantity
      ) VALUES (
        1,
        100,
        1
      ), (
        2,
        1000,
        2
      ), (
        3,
        1000,
        20
      ), (
        4,
        1000,
        0
      ), (
        5,
        1000,
        null
      ), (
        6,
        1000,
        null
      ), (
        7,
        1000,
        null
      ), (
        8,
        1000,
        null
      ), (
        9,
        1000,
        null
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.stock RESTART IDENTITY CASCADE;`);
  }
}
