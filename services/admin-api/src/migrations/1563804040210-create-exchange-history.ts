import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateExchangeHistory1563804040210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TYPE ${ns}.exchange_event_enum AS ENUM (
        'Claim',
        'Craft',
        'Breed',
        'Mysterybox',
        'Purchase',
        'Paused',
        'Unpaused',
        'Reward'
      );`,
    );

    // MODULE:WAITLIST
    await queryRunner.query(`ALTER TYPE ${ns}.exchange_event_enum ADD VALUE 'RewardSet';`);
    await queryRunner.query(`ALTER TYPE ${ns}.exchange_event_enum ADD VALUE 'ClaimReward';`);

    const table = new Table({
      name: `${ns}.exchange_history`,
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
          type: `${ns}.exchange_event_enum`,
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
    await queryRunner.dropTable(`${ns}.exchange_history`);
    await queryRunner.query(`DROP TYPE ${ns}.exchange_event_enum;`);
  }
}
