import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateCartItem1683724062210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.cart_item`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "cart_id",
          type: "int",
        },
        {
          name: "product_item_id",
          type: "int",
        },
        {
          name: "quantity",
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
          columnNames: ["product_item_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.product_item`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["cart_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.cart`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.cart_item`);
  }
}
