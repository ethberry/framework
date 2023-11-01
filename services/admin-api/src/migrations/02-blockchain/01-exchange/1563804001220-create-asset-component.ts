import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

import { ns } from "@framework/constants";

export class CreateAssetComponent1563804001220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.asset_component`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "token_type",
          type: `${ns}.token_type_enum`,
          default: "'NATIVE'",
        },
        {
          name: "contract_id",
          type: "int",
        },
        {
          name: "template_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "token_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "amount",
          type: "uint256",
        },
        {
          name: "asset_id",
          type: "int",
        },
      ],
      foreignKeys: [
        {
          columnNames: ["asset_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["contract_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.contract`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["template_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.template`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["token_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.token`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);

    const index = new TableIndex({
      columnNames: ["contract_id"],
    });

    await queryRunner.createIndex(`${ns}.asset_component`, index);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
