import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedParameter1593408358880 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.parameter (
        parameter_name,
        parameter_type,
        parameter_value,
        parameter_min_value,
        parameter_max_value
      ) VALUES (
        'COLOR',
        'ENUM',
        'RED',
        null,
        null
      ), (
        'COLOR',
        'ENUM',
        'GREEN',
        null,
        null
      ), (
        'COLOR',
        'ENUM',
        'BLUE',
        null,
        null
      ), (
        'SIZE',
        'ENUM',
        'XS',
        null,
        null
      ), (
        'SIZE',
        'ENUM',
        'S',
        null,
        null
      ), (
        'SIZE',
        'ENUM',
        'M',
        null,
        null
      ), (
        'SIZE',
        'ENUM',
        'L',
        null,
        null
      ), (
        'SIZE',
        'ENUM',
        'XL',
        null,
        null
      ), (
        'SIZE',
        'ENUM',
        'XXL',
        null,
        null
      ), (
        'SIZE',
        'ENUM',
        'XXXL',
        null,
        null
      ), (
        'VOLUME',
        'NUMBER',
        null,
        100,
        10000
      ), (
        'FLAVOUR',
        'STRING',
        null,
        3,
        50
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.parameter RESTART IDENTITY CASCADE;`);
  }
}
