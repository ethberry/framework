import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { NodeEnv } from "@ethberry/constants";
import { ns } from "@framework/constants";

export class CreateAchievementRule1681273013010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.achievement_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.achievement_rule`,
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
          name: "event_type",
          type: "varchar",
          isNullable: true,
        },
        {
          name: "contract_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "item_id",
          type: "bigint",
          isNullable: true,
        },
        {
          name: "achievement_status",
          type: `${ns}.achievement_status_enum`,
          default: "'ACTIVE'",
        },
        {
          name: "start_timestamp",
          type: "timestamptz",
        },
        {
          name: "end_timestamp",
          type: "timestamptz",
          isNullable: true,
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
          columnNames: ["item_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);

    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    await queryRunner.query(`SELECT setval('${ns}.achievement_rule_id_seq', 5000, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.achievement_rule`);
  }
}
