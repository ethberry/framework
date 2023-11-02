import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateGrade1657846587000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.grade_strategy_enum AS ENUM (
        'FLAT',
        'LINEAR',
        'EXPONENTIAL'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.grade_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.grade`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "grade_strategy",
          type: `${ns}.grade_strategy_enum`,
        },
        {
          name: "grade_status",
          type: `${ns}.grade_status_enum`,
          default: "'ACTIVE'",
        },
        {
          name: "attribute",
          type: "varchar",
        },
        {
          name: "price_id",
          type: "bigint",
        },
        {
          name: "contract_id",
          type: "int",
        },
        {
          name: "growth_rate",
          type: "int",
          default: 0,
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
          columnNames: ["contract_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.contract`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["price_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.grade`);
    await queryRunner.query(`DROP TYPE ${ns}.grade_strategy_enum;`);
  }
}
