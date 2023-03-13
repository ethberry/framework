import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateOrder1593490663230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.order_status_enum AS ENUM (
        'NEW',
        'SCHEDULED',
        'NOW_IN_DELIVERY',
        'DELIVERED',
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
          name: "address_id",
          type: "int",
        },
        {
          name: "merchant_id",
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
          name: "price_correction",
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
          columnNames: ["address_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.address`,
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
