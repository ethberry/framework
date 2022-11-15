import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateVesting1653616433210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.vesting_contract_template_enum AS ENUM (
        'LINEAR',
        'GRADED',
        'CLIFF'
      );
    `);

    const table = new Table({
      name: `${ns}.vesting`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "account",
          type: "varchar",
        },
        {
          name: "duration",
          type: "real",
        },
        {
          name: "start_timestamp",
          type: "timestamptz",
        },
        {
          name: "contract_template",
          type: `${ns}.vesting_contract_template_enum`,
          default: "'LINEAR'",
        },
        {
          name: "contract_id",
          type: "int",
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
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.vesting`);
  }
}
