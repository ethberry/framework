import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateWaitListItem1663047650300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.wait_list_status_enum AS ENUM (
        'NEW',
        'REDEEMED'
      );
    `);

    const table = new Table({
      name: `${ns}.wait_list_item`,
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
          name: "wait_list_status",
          type: `${ns}.wait_list_status_enum`,
          default: "'NEW'",
        },
        {
          name: "list_id",
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
          columnNames: ["list_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.wait_list_list`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.wait_list_item`);
  }
}
