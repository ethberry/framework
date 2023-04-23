import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedParameter1593408358880 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.parameter (
        parameter_name,
        parameter_type,
        parameter_value,
        parameter_extra
      ) VALUES (
        'COLOR',
        'enum',
        'RED',
        null
      ), (
        'COLOR',
        'enum',
        'GREEN',
        null
      ), (
        'COLOR',
        'enum',
        'BLUE',
        null
      ), (
        'SIZE',
        'enum',
        'XS',
        null
      ), (
        'SIZE',
        'enum',
        'S',
        null
      ), (
        'SIZE',
        'enum',
        'M',
        null
      ), (
        'SIZE',
        'enum',
        'L',
        null
      ), (
        'SIZE',
        'enum',
        'XL',
        null
      ), (
        'SIZE',
        'enum',
        'XXL',
        null
      ), (
        'SIZE',
        'enum',
        'XXXL',
        null
      ), (
        'VOLUME',
        'number',
        null,
        10000
      ), (
        'FLAVOUR',
        'string',
        null,
        null
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.parameter RESTART IDENTITY CASCADE;`);
  }
}
