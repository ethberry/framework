import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc20VestingTable1563804021115 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc20_vesting_template_enum AS ENUM (
        'FLAT'
      );
    `);

    const table = new Table({
      name: `${ns}.erc20_vesting`,
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
          name: "beneficiary",
          type: "varchar",
        },
        {
          name: "duration",
          type: "int",
        },
        {
          name: "start_timestamp",
          type: "timestamptz",
        },
        {
          name: "vesting_template",
          type: `${ns}.erc20_vesting_template_enum`,
          default: "'FLAT'",
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
    await queryRunner.dropTable(`${ns}.erc20_vesting`);
  }
}
