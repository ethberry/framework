import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@framework/constants";

export class CreateProductToParameter1593408358950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.product_to_parameter`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "product_id",
          type: "int",
        },
        {
          name: "parameter_id",
          type: "int",
        },
        {
          name: "parameter_value",
          type: "varchar",
          isNullable: true,
        },
      ],
      foreignKeys: [
        {
          columnNames: ["product_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.product`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["parameter_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.parameter`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.product_to_parameter`);
  }
}
