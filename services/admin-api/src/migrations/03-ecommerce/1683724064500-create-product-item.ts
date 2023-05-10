import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@framework/constants";

export class CreateProductItem1683724064500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // weight: number;
    const table = new Table({
      name: `${ns}.product_item`,
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
          name: "price_id",
          type: "int",
        },
        {
          name: "min_quantity",
          type: "int",
          isNullable: true,
          default: "0",
        },
        {
          name: "max_quantity",
          type: "int",
          isNullable: true,
        },
        {
          name: "sku",
          type: "varchar",
        },
        {
          name: "weight",
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
          columnNames: ["product_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.product`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["price_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.product_item`);
  }
}
