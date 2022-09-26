import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateLotteryRoundAt1660436477000 implements MigrationInterface {
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
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.lottery_round`);
  }
}
