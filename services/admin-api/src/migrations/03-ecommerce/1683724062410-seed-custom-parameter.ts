import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedCustomParameter1683724062410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.custom_parameter (
        product_item_id,
        parameter_name,
        parameter_type,
        parameter_value,
        user_id
      ) VALUES (
        6,
        'COLOR',
        'ENUM',
        'INDIGO',
        1
      ), (
        7,
        'COLOR',
        'ENUM',
        'YELLOW',
        1
      ), (
        8,
        'SIZE',
        'ENUM',
        'XXXXL',
        1
      ), (
        8,
        'SIZE',
        'ENUM',
        'XXS',
        1
      ), (
        9,
        'COLOR',
        'ENUM',
        'VIOLET',
        1
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.custom_parameter RESTART IDENTITY CASCADE;`);
  }
}
