import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@framework/constants";

export class CreateErc998TemplateTable1563804030110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc998_template_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.erc998_template`,
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
          name: "image_url",
          type: "varchar",
        },
        {
          name: "attributes",
          type: "json",
        },
        {
          name: "price",
          type: "uint256",
        },
        {
          name: "amount",
          type: "int",
          default: 0,
        },
        {
          name: "instance_count",
          type: "int",
          default: 0,
        },
        {
          name: "erc998_collection_id",
          type: "int",
        },
        {
          name: "template_status",
          type: `${ns}.erc998_template_status_enum`,
          default: "'ACTIVE'",
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
          columnNames: ["erc998_collection_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc998_collection`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.erc998_template`);
    await queryRunner.query(`DROP TYPE ${ns}.erc998_template_status_enum;`);
  }
}
