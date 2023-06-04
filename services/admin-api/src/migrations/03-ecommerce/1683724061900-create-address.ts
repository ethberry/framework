import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@framework/constants";

export class CreateAddress1683724061900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.address_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.address`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "address_line1",
          type: "varchar",
        },
        {
          name: "address_line2",
          type: "varchar",
          isNullable: true,
          default: "''",
        },
        {
          name: "city",
          type: "varchar",
        },
        {
          name: "country",
          type: "varchar",
        },
        {
          name: "state",
          type: "varchar",
          isNullable: true,
          default: "''",
        },
        {
          name: "zip",
          type: "varchar",
        },
        {
          name: "user_id",
          type: "int",
        },
        {
          name: "is_default",
          type: "boolean",
        },
        {
          name: "address_status",
          type: `${ns}.address_status_enum`,
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
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.address`);
    await queryRunner.query(`DROP TYPE ${ns}.address_status_enum;`);
  }
}
