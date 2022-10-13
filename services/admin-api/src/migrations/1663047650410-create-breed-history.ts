import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateBreedHistory1663047650410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.breed_history`,
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
          name: "child_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "matron_id",
          type: "int",
        },
        {
          name: "sire_id",
          type: "int",
        },
        {
          name: "history_id",
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
          columnNames: ["child_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.breed`,
        },
        {
          columnNames: ["matron_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.breed`,
        },
        {
          columnNames: ["sire_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.breed`,
        },
        {
          columnNames: ["history_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.exchange_history`,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.breed_history`);
  }
}
