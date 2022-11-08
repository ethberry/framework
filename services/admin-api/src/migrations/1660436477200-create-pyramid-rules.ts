import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreatePyramidRules1660436477200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.pyramid_rule_status_enum AS ENUM (
        'NEW',
        'ACTIVE',
        'INACTIVE'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.pyramid_rule_duration_unit_enum AS ENUM (
        'DAY',
        'HOUR',
        'MINUTE'
      );
    `);

    const table = new Table({
      name: `${ns}.pyramid_rules`,
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
          name: "duration_amount",
          type: "int",
        },
        {
          name: "duration_unit",
          type: `${ns}.pyramid_rule_duration_unit_enum`,
          default: "'DAY'",
        },
        {
          name: "penalty",
          type: "int",
        },
        {
          name: "contract_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "deposit_id",
          type: "int",
        },
        {
          name: "reward_id",
          type: "int",
        },
        {
          name: "external_id",
          type: "varchar",
          isNullable: true,
        },
        {
          name: "pyramid_rule_status",
          type: `${ns}.pyramid_rule_status_enum`,
          default: "'NEW'",
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
          columnNames: ["deposit_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["reward_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.pyramid_rules`);
  }
}
