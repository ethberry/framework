import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateRaffleRoundAt1685961136110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.raffle_round`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "number",
          type: "uint256",
          isNullable: true,
        },
        {
          name: "round_id",
          type: "uint256",
        },
        {
          name: "contract_id",
          type: "int",
        },
        {
          name: "ticket_contract_id",
          type: "int",
        },
        {
          name: "price_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "max_tickets",
          type: "int",
          isNullable: true,
        },
        {
          name: "start_timestamp",
          type: "timestamptz",
        },
        {
          name: "end_timestamp",
          type: "timestamptz",
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
          columnNames: ["contract_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.contract`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["ticket_contract_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.contract`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["price_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.raffle_round`);
  }
}
