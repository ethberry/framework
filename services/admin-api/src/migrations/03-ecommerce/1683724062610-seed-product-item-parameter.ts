import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedProductItemParameter1683724062610 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.product_item_parameter (
        product_item_id,
        parameter_id,
        custom_parameter_id,
        user_custom_value,
        created_at,
        updated_at
      ) VALUES (
        4,
        1,
        null,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        4,
        null,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        1,
        null,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        7,
        null,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        6,
        null,
        1,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        6,
        6,
        null,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        7,
        null,
        2,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        7,
        8,
        null,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        8,
        2,
        null,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        8,
        null,
        3,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        9,
        null,
        4,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        9,
        7,
        null,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.product_item_parameter RESTART IDENTITY CASCADE;`);
  }
}
