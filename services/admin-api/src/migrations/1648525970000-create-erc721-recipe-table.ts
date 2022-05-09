import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc721Recipe1648525970000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc721_recipe_status_enum AS ENUM (
        'NEW',
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.erc721_recipe`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "erc721_template_id",
          type: "int",
        },
        {
          name: "erc721_dropbox_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "recipe_status",
          type: `${ns}.erc721_recipe_status_enum`,
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
          columnNames: ["erc721_template_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc721_template`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["erc721_dropbox_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc721_dropbox`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.erc721_recipe`);
    await queryRunner.query(`DROP TYPE ${ns}.erc721_recipe_status_enum;`);
  }
}
