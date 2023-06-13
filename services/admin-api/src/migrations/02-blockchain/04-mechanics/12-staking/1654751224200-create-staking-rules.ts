import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateStakingRules1654751224200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.staking_rule_status_enum AS ENUM (
        'NEW',
        'ACTIVE',
        'INACTIVE'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.staking_rule_duration_unit_enum AS ENUM (
        'DAY',
        'HOUR',
        'MINUTE'
      );
    `);

    const table = new Table({
      name: `${ns}.staking_rules`,
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
          type: `${ns}.staking_rule_duration_unit_enum`,
          default: "'DAY'",
        },
        {
          name: "penalty",
          type: "int",
        },
        {
          name: "max_stake",
          type: "int",
          isNullable: true,
        },
        {
          name: "recurrent",
          type: "boolean",
        },
        {
          name: "deposit_id",
          type: "int",
        },
        {
          name: "reward_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "external_id",
          type: "varchar",
          isNullable: true,
        },
        {
          name: "contract_id",
          type: "int",
        },
        {
          name: "staking_rule_status",
          type: `${ns}.staking_rule_status_enum`,
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
    await queryRunner.dropTable(`${ns}.staking_rules`);
  }
}
