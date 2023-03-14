import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateOrderItem1593505694820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.order_item`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "amount",
          type: "int",
        },
        {
          name: "product_id",
          type: "int",
        },
        {
          name: "order_id",
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
          columnNames: ["product_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.product`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["order_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.order`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.order_item`);
  }
}
