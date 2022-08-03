import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateStakes1654751224300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.stake_status_enum AS ENUM (
        'ACTIVE',
        'CANCELED',
        'COMPLETE'
      );
    `);

    const table = new Table({
      name: `${ns}.staking_stakes`,
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
          name: "stake_status",
          type: `${ns}.stake_status_enum`,
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
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_stakes`);
    await queryRunner.query(`DROP TYPE ${ns}.stake_status_enum;`);
  }
}
