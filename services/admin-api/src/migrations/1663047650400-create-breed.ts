import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateBreed1663047650400 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.breed`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "genes",
          type: "varchar",
        },
        {
          name: "count",
          type: "int",
        },
        {
          name: "token_id",
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
          columnNames: ["token_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.token`,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.breed`);
  }
}
