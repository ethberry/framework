import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc1155RecipeHistory1645160381140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc1155_recipe_event_enum AS ENUM (
        'RecipeCreated',
        'RecipeUpdated',
        'RecipeCrafted'
      );
    `);

    const table = new Table({
      name: `${ns}.erc1155_recipe_history`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "address",
          type: "varchar",
        },
        {
          name: "transaction_hash",
          type: "varchar",
        },
        {
          name: "event_type",
          type: `${ns}.erc1155_recipe_event_enum`,
        },
        {
          name: "event_data",
          type: "json",
        },
        {
          name: "erc1155_recipe_id",
          type: "int",
          isNullable: true,
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
          columnNames: ["erc1155_recipe_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc1155_recipe`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.erc1155_token_history`);
    await queryRunner.query(`DROP TYPE ${ns}.erc1155_marketplace_event_enum;`);
  }
}
