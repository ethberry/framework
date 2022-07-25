import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateContractManagerHistory1652682493386 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.contract_manager_event_enum AS ENUM (
        'VestingDeployed',
        'ERC20TokenDeployed',
        'ERC721TokenDeployed',
        'ERC998TokenDeployed',
        'ERC1155TokenDeployed'
      );
    `);

    const table = new Table({
      name: `${ns}.contract_manager_history`,
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
          type: `${ns}.contract_manager_event_enum`,
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
    await queryRunner.dropTable(`${ns}.contract_manager_history`);
    await queryRunner.query(`DROP TYPE ${ns}.contract_manager_event_enum;`);
  }
}
