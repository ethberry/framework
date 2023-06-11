import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreatePhoto1683724061800 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.photo_status_enum AS ENUM (
        'NEW',
        'APPROVED',
        'DECLINED'
      );
    `);

    const table = new Table({
      name: `${ns}.photo`,
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
          name: "image_url",
          type: "varchar",
        },
        {
          name: "product_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "product_item_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "priority",
          type: "int",
          default: 0,
        },
        {
          name: "photo_status",
          type: `${ns}.photo_status_enum`,
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
          columnNames: ["product_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.product`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["product_item_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.product_item`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.photo`);
    await queryRunner.query(`DROP TYPE ${ns}.photo_status_enum;`);
  }
}
