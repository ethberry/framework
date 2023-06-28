import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateCraft1653616448010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.craft_status_enum AS ENUM (
        'NEW',
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.craft`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "item_id",
          type: "int",
        },
        {
          name: "price_id",
          type: "int",
        },
        {
          name: "merchant_id",
          type: "int",
        },
        {
          name: "craft_status",
          type: `${ns}.craft_status_enum`,
          default: "'NEW'",
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
          columnNames: ["item_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["price_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
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
    await queryRunner.dropTable(`${ns}.craft`);
    await queryRunner.query(`DROP TYPE ${ns}.craft_status_enum;`);
  }
}
