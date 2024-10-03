import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns, testChainId } from "@framework/constants";

export class CreateEventHistory1563804040010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.event_history`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          // this was an enum, but it is just a pain to keep it updated
          name: "event_type",
          type: "varchar",
        },
        {
          name: "address",
          type: "varchar",
        },
        {
          name: "chain_id",
          type: "int",
          default: testChainId,
        },
        {
          name: "transaction_hash",
          type: "varchar",
        },
        {
          name: "event_data",
          type: "json",
        },
        {
          name: "token_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "contract_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "parent_id",
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
          columnNames: ["token_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.token`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["contract_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.contract`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["parent_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.event_history`,
          onDelete: "SET NULL",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.event_history`);
  }
}
