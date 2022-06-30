import { MigrationInterface, QueryRunner, Table } from "typeorm";

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
          name: "uni_contract_id",
          type: "int",
        },
        {
          name: "uni_token_id",
          type: "int",
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
          columnNames: ["uni_contract_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.uni_contract`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["uni_token_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.uni_token`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component`);
  }
}
