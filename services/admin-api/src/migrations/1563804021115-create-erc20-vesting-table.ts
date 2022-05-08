import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc20VestingTable1563804021115 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc20_vesting_type_enum AS ENUM (
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
          name: "token",
          type: "varchar",
        },
        {
          name: "amount",
          type: "uint256",
        },
        {
          name: "erc20_token_id",
          type: "int",
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
          name: "vesting_type",
          type: `${ns}.erc20_vesting_type_enum`,
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
      foreignKeys: [
        {
          columnNames: ["erc20_token_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc20_token`,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.erc20_vesting`);
  }
}
