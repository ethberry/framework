import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedProductItemParameter1683724062610 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.product_item_parameter (
        product_item_id,
        parameter_id,
        custom_parameter_id,
        user_custom_value
      ) VALUES (
        1,
        11,
        null,
        '500'
      ), (
        4,
        1,
        null,
        null
      ), (
        4,
        4,
        null,
        null
      ), (
        5,
        1,
        null,
        null
      ), (
        5,
        7,
        null,
        null
      ), (
        6,
        null,
        1,
        null
      ), (
        6,
        6,
        null,
        null
      ), (
        7,
        null,
        2,
        null
      ), (
        7,
        8,
        null,
        null
      ), (
        8,
        2,
        null,
        null
      ), (
        8,
        null,
        3,
        null
      ), (
        9,
        null,
        5,
        null
      ), (
        9,
        7,
        null,
        null
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.product_item_parameter RESTART IDENTITY CASCADE;`);
  }
}
