import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateContractManager1652962207600 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.contract_manager_type_enum AS ENUM (
        'CONTRACT_MANAGER',
        'AIRDROP',
        'LOOTBOX',
        'STAKING',
        'VESTING',
        'EXCHANGE',
        'ERC20_TOKEN',
        'ERC721_TOKEN',
        'ERC998_TOKEN',
        'ERC1155_TOKEN'
      );
    `);

    const table = new Table({
      name: `${ns}.contract_manager`,
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
          name: "contract_type",
          type: `${ns}.contract_manager_type_enum`,
        },
        {
          name: "from_block",
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
    await queryRunner.dropTable(`${ns}.contract_manager`);
    await queryRunner.query(`DROP TYPE ${ns}.contract_manager_type_enum;`);
  }
}
