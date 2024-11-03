import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateVestingBox1563804100590 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.vesting_box_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.vesting_function_type_enum AS ENUM (
        'LINEAR',
        'HYPERBOLIC',
        'EXPONENTIAL'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.vesting_shape_type_enum AS ENUM (
        'LINEAR',
        'LINEAR_CLIFF',
        'LINEAR_IMMEDIATE',
        'LINEAR_CLIFF_IMMEDIATE',
        'LINEAR_STEPS',
        'EXPONENTIAL',
        'EXPONENTIAL_CLIFF',
        'EXPONENTIAL_IMMEDIATE',
        'EXPONENTIAL_CLIFF_IMMEDIATE',
        'HYPERBOLIC',
        'HYPERBOLIC_CLIFF',
        'HYPERBOLIC_IMMEDIATE',
        'HYPERBOLIC_CLIFF_IMMEDIATE'
      );
    `);

    const table = new Table({
      name: `${ns}.vesting_box`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "title",
          type: "varchar",
        },
        {
          name: "description",
          type: "json",
        },
        {
          name: "image_url",
          type: "varchar",
        },
        {
          name: "content_id",
          type: "bigint",
        },
        {
          name: "template_id",
          type: "int",
        },
        {
          name: "vesting_box_status",
          type: `${ns}.vesting_box_status_enum`,
          default: "'ACTIVE'",
        },
        {
          name: "function_type",
          type: `${ns}.vesting_function_type_enum`,
          default: "'LINEAR'",
        },
        {
          name: "shape",
          type: `${ns}.vesting_shape_type_enum`,
          default: "'LINEAR'",
        },
        {
          name: "cliff",
          type: "int",
        },
        {
          name: "start_timestamp",
          type: "timestamptz",
        },
        {
          name: "duration",
          type: "int",
        },
        {
          name: "period",
          type: "int",
        },
        {
          name: "after_cliff_basis_points",
          type: "int",
        },
        {
          name: "growth_rate",
          type: "int",
        },
        {
          name: "created_at",
          type: "timestamptz",
        },
        {
          name: "updated_at",
          type: "timestamptz",
        },
      ],
      foreignKeys: [
        {
          columnNames: ["content_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["template_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.template`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.loot_box`);
    await queryRunner.query(`DROP TYPE ${ns}.loot_box_status_enum;`);
  }
}
