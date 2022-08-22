import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateOwnershipAt1658980520100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.ownership`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "parent_id",
          type: "int",
        },
        {
          name: "child_id",
          type: "int",
        },
        {
          name: "amount",
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
          columnNames: ["parent_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.token`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["child_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.token`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.ownership`);
  }
}
