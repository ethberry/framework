import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { NodeEnv } from "@ethberry/constants";
import { ns } from "@framework/constants";

export class CreateLotteryRoundAggregationAt1660436476130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.lottery_round_aggregation`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "round_id",
          type: "int",
        },
        {
          name: "match",
          type: "int", // 1-6
        },
        {
          name: "tickets",
          type: "int",
        },
        {
          name: "price_id",
          type: "bigint",
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
          columnNames: ["round_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.lottery_round`,
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

    await queryRunner.query(`SELECT setval('${ns}.lottery_round_aggregation_id_seq', 50000, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.lottery_round_aggregation`);
  }
}
