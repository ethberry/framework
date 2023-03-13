import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreatePyramidDeposit1660436477300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.pyramid_deposit_status_enum AS ENUM (
        'ACTIVE',
        'CANCELED',
        'COMPLETE'
      );
    `);
    const table = new Table({
      name: `${ns}.pyramid_deposit`,
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
          name: "pyramid_deposit_status",
          type: `${ns}.pyramid_deposit_status_enum`,
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
          name: "pyramid_rule_id",
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
          columnNames: ["pyramid_rule_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.pyramid_rules`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.pyramid_deposit`);
    await queryRunner.query(`DROP TYPE ${ns}.pyramid_deposit_status_enum;`);
  }
}
