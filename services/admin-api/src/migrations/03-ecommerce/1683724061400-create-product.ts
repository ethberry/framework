import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@framework/constants";

export class CreateProduct1683724061400 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.product_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.product`,
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
          name: "description",
          type: "json",
        },
        {
          name: "merchant_id",
          type: "int",
        },
        {
          name: "height",
          type: "int",
        },
        {
          name: "width",
          type: "int",
        },
        {
          name: "length",
          type: "int",
        },
        {
          name: "weight",
          type: "int",
        },
        {
          name: "product_status",
          type: `${ns}.product_status_enum`,
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
    await queryRunner.dropTable(`${ns}.product`);
    await queryRunner.query(`DROP TYPE ${ns}.product_status_enum;`);
  }
}
