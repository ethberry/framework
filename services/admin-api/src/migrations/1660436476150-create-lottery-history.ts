import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateLotteryHistoryAt1660436476150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TYPE ${ns}.lottery_event_enum AS ENUM (
        'RoundFinalized',
        'RoundStarted',
        'RoundEnded',
        'Purchase',
        'Released',
        'Prize',
        'RandomRequest'
      );`,
    );

    const table = new Table({
      name: `${ns}.lottery_history`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "address",
          type: "varchar",
        },
        {
          name: "transaction_hash",
          type: "varchar",
        },
        {
          name: "event_type",
          type: `${ns}.lottery_event_enum`,
        },
        {
          name: "event_data",
          type: "json",
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
    await queryRunner.dropTable(`${ns}.lottery_history`);
    await queryRunner.query(`DROP TYPE ${ns}.lottery_event_enum;`);
  }
}
