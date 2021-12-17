import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@gemunion/framework-constants";

export class CreateOrderTable1593490663230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.order_status_enum AS ENUM (
        'NEW',
        'CLOSED',
        'CANCELED'
      );
    `);

    const table = new Table({
      name: `${ns}.order`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "order_status",
          type: `${ns}.order_status_enum`,
        },
        {
          name: "merchant_id",
          type: "int",
        },
        {
          name: "product_id",
          type: "int",
        },
        {
          name: "user_id",
          type: "int",
        },
        {
          name: "price",
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
          columnNames: ["user_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.user`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["merchant_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.merchant`,
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
    await queryRunner.dropTable(`${ns}.order`);
    await queryRunner.query(`DROP TYPE ${ns}.order_status_enum;`);
  }
}
