import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@gemunion/framework-constants";

export class CreateTransactionTable1639131041954 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.transaction_status_enum AS ENUM (
        'NEW',
        'MINED',
        'CONFIRMED',
        'ERRORED'
      );
    `);

    const table = new Table({
      name: `${ns}.transaction`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "transaction_hash",
          type: "varchar",
          isUnique: true,
        },
        {
          name: "block_number",
          type: "int",
          isNullable: true,
        },
        {
          name: "status",
          type: `${ns}.transaction_status_enum`,
          default: "'NEW'",
        },
        {
          name: "project_id",
          type: "int",
        },
        {
          name: "user_id",
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
          columnNames: ["user_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.user`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["project_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.project`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.transaction`);
  }
}
