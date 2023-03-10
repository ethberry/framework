import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateAssetComponentHistory1657846609000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TYPE ${ns}.exchange_type_enum AS ENUM (
        'ITEM',
        'PRICE'
      );`,
    );

    const table = new Table({
      name: `${ns}.asset_component_history`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "history_id",
          type: "int",
        },
        {
          name: "exchange_type",
          type: `${ns}.exchange_type_enum`,
        },
        {
          name: "contract_id",
          type: "int",
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
      ],
      foreignKeys: [
        {
          columnNames: ["history_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.event_history`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["contract_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.contract`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset_component_history`);
  }
}
