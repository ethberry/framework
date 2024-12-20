import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@framework/constants";

export class CreateCategory1683724061300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.category`,
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
          name: "parent_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "merchant_id",
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
          referencedTableName: `${ns}.category`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["merchant_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.merchant`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.category`);
  }
}
