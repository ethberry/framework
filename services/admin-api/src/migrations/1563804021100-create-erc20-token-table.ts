import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc20TokenTable1563804021100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc20_token_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.erc20_token`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "title",
          type: "varchar",
        },
        {
          name: "description",
          type: "json",
        },
        {
          name: "token_status",
          type: `${ns}.erc20_token_status_enum`,
          default: "'ACTIVE'",
        },
        {
          name: "symbol",
          type: "varchar",
        },
        {
          name: "amount",
          type: "uint256",
        },
        {
          name: "address",
          type: "varchar",
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
    await queryRunner.dropTable(`${ns}.erc20_token`);
    await queryRunner.query(`DROP TYPE ${ns}.erc20_token_status_enum;`);
  }
}
