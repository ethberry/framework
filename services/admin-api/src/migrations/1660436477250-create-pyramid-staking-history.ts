import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreatePyramidStakingHistory1660436477250 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.query(`
    //   CREATE TYPE ${ns}.staking_event_enum AS ENUM (
    //     'RuleCreated',
    //     'RuleUpdated',
    //     'StakingStart',
    //     'StakingWithdraw',
    //     'StakingFinish',
    //     'FinalizedToken'
    //   );
    // `);
    const table = new Table({
      name: `${ns}.pyramid_history`,
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
          type: `${ns}.staking_event_enum`,
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
    await queryRunner.dropTable(`${ns}.pyramid_history`);
    await queryRunner.query(`DROP TYPE ${ns}.staking_event_enum;`);
  }
}
