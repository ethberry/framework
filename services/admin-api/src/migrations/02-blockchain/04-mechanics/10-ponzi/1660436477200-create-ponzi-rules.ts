import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreatePonziRules1660436477200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.ponzi_rule_status_enum AS ENUM (
        'NEW',
        'ACTIVE',
        'INACTIVE'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.ponzi_rule_duration_unit_enum AS ENUM (
        'DAY',
        'HOUR',
        'MINUTE'
      );
    `);

    const table = new Table({
      name: `${ns}.ponzi_rules`,
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
          type: `${ns}.ponzi_rule_duration_unit_enum`,
          default: "'DAY'",
        },
        {
          name: "penalty",
          type: "int",
        },
        {
          name: "max_cycles",
          type: "int",
          default: 0,
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
          name: "ponzi_rule_status",
          type: `${ns}.ponzi_rule_status_enum`,
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
    await queryRunner.dropTable(`${ns}.ponzi_rules`);
  }
}
