import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@gemunion/framework-constants";

export class CreateProductToCategoryTable1593408358915 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.product_to_category`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "category_id",
          type: "int",
          isPrimary: true,
        },
        {
          name: "product_id",
          type: "int",
          isPrimary: true,
        },
      ],
      foreignKeys: [
        {
          columnNames: ["category_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.category`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["product_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.product`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.product_to_category`);
  }
}
