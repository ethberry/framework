import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreatePyramidDepositHistory1660436477400 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.pyramid_event_enum AS ENUM (
        'RuleCreated',
        'RuleUpdated',
        'StakingStart',
        'StakingWithdraw',
        'StakingFinish',
        'FinalizedToken',
        'PayeeAdded',
        'PaymentReleased',
        'ERC20PaymentReleased',
        'PaymentEthReceived',
        'PaymentReceived',
        'PaymentEthSent',
        'WithdrawToken',
      );
    `);

    const table = new Table({
      name: `${ns}.pyramid_deposit_history`,
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
          type: `${ns}.pyramid_event_enum`,
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
    await queryRunner.dropTable(`${ns}.pyramid_deposit_history`);
    await queryRunner.query(`DROP TYPE ${ns}.pyramid_event_enum;`);
  }
}
