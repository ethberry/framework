import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedStock1683724064610 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.stock (
        product_item_id,
        parameter_id,
        custom_parameter_id,
        user_custom_value
      ) VALUES (
        1,
        11,
        500
      ), (
        2,
        11,
        1000
      ), (
        3,
        11,
        5000
      ), (
        4,
        1,
        null
      ), (
        5,
        2,
        null
      ), (
        6,
        3,
        null
      ), (
        4,
        5,
        null
      ), (
        5,
        6,
        null
      ), (
        6,
        7,
        null
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.stock RESTART IDENTITY CASCADE;`);
  }
}
