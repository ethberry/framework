import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateStakesTable1654751224255 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.stake_status_enum AS ENUM (
        'ACTIVE',
        'FINISH'
      );
    `);

    const table = new Table({
      name: `${ns}.stakes`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "owner",
          type: "varchar",
        },
        {
          name: "stake_status",
          type: `${ns}.stake_status_enum`,
          default: "'ACTIVE'",
        },
        {
          name: "stake_id",
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
          name: "staking_id",
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
          columnNames: ["staking_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.staking_rules`,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.stakes`);
    await queryRunner.query(`DROP TYPE ${ns}.stake_status_enum;`);
  }
}
