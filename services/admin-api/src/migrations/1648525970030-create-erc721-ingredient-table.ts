import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc721Ingredient1648525970030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.erc721_ingredient`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "erc721_recipe_id",
          type: "int",
          isPrimary: true,
        },
        {
          name: "erc1155_token_id",
          type: "int",
          isPrimary: true,
        },
        {
          name: "amount",
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
          columnNames: ["erc721_recipe_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc721_recipe`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["erc1155_token_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc1155_token`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.erc721_ingredient`);
  }
}
