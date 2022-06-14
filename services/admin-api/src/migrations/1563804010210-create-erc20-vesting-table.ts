import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc20VestingTable1563804010210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.vesting_contract_template_enum AS ENUM (
        'LINEAR',
        'GRADED',
        'CLIFF'
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
          type: "bigint",
        },
        {
          name: "start_timestamp",
          type: "timestamptz",
        },
        {
          name: "contract_template",
          type: `${ns}.vesting_contract_template_enum`,
          default: "'LINEAR'",
        },
        {
          name: "chain_id",
          type: "int",
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
