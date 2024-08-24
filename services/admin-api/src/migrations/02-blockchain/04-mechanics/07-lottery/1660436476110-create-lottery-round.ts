import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { NodeEnv } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class CreateLotteryRoundAt1660436476100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.lottery_round`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "numbers",
          type: "boolean",
          isArray: true,
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
          type: "bigint",
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

    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    await queryRunner.query(`SELECT setval('${ns}.lottery_round_id_seq', 50000, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.lottery_round`);
  }
}
