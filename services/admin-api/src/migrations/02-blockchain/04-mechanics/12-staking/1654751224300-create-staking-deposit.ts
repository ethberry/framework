import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

import { ns } from "@framework/constants";

export class CreateStakingDeposit1654751224300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.staking_deposit_status_enum AS ENUM (
        'ACTIVE',
        'CANCELED',
        'COMPLETE'
      );
    `);

    const table = new Table({
      name: `${ns}.staking_deposit`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "account",
          type: "varchar",
        },
        {
          name: "staking_deposit_status",
          type: `${ns}.staking_deposit_status_enum`,
          default: "'ACTIVE'",
        },
        {
          name: "external_id",
          type: "uint256",
        },
        {
          name: "start_timestamp",
          type: "timestamptz",
        },
        {
          name: "withdraw_timestamp",
          type: "timestamptz",
          isNullable: true,
        },
        {
          name: "staking_rule_id",
          type: "int",
        },
        {
          name: "multiplier",
          type: "int",
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
          columnNames: ["staking_rule_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.staking_rules`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);

    const index = new TableIndex({
      columnNames: ["start_timestamp"],
    });

    await queryRunner.createIndex(`${ns}.staking_deposit`, index);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_deposit`);
    await queryRunner.query(`DROP TYPE ${ns}.staking_deposit_status_enum;`);
  }
}
