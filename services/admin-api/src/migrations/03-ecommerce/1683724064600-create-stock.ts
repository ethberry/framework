import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@framework/constants";

export class CreateStock1683724064600 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.stock`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "product_item_id",
          type: "int",
        },
        {
          name: "parameter_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "custom_parameter_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "user_custom_value",
          type: "varchar",
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
          columnNames: ["product_item_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.product_item`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["parameter_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.parameter`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["custom_parameter_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.custom_parameter`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.stock`);
  }
}
