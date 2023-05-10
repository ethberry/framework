import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";
import { ns } from "@framework/constants";

export class CreateCustomParameter1683724064400 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.custom_parameter_type_enum AS ENUM (
        'DATE',
        'ENUM',
        'NUMBER',
        'STRING'
      );
    `);

    const table = new Table({
      name: `${ns}.custom_parameter`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "product_item_id",
          type: "varchar",
        },
        {
          name: "user_id",
          type: "int",
        },
        {
          name: "parameter_name",
          type: "varchar",
        },
        {
          name: "parameter_type",
          type: `${ns}.custom_parameter_type_enum`,
        },
        {
          name: "parameter_value",
          type: "varchar",
          isNullable: true,
        },
      ],
    });

    await queryRunner.createTable(table, true);

    const index = new TableIndex({
      columnNames: ["parameter_name", "parameter_type", "parameter_value"],
      isUnique: true,
    });

    await queryRunner.createIndex(`${ns}.custom_parameter`, index);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.custom_parameter`);
  }
}
