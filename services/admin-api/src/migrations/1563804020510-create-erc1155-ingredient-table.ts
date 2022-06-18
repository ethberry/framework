import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc1155Ingredient1563804020510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.erc1155_ingredient`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "erc1155_recipe_id",
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
      ],
      foreignKeys: [
        {
          columnNames: ["erc1155_recipe_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc1155_recipe`,
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
    await queryRunner.dropTable(`${ns}.erc1155_ingredient`);
  }
}
