import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc1155TokenTable1563804020120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc1155_token_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.erc1155_token`,
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
          name: "token_id",
          type: "uint256",
        },
        {
          name: "erc1155_collection_id",
          type: "int",
        },
        {
          name: "erc20_token_id",
          type: "int",
        },
        {
          name: "token_status",
          type: `${ns}.erc1155_token_status_enum`,
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
          columnNames: ["erc1155_collection_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc1155_collection`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["erc20_token_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc20_token`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.erc1155_token`);
    await queryRunner.query(`DROP TYPE ${ns}.erc1155_token_status_enum;`);
  }
}
