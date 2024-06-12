import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns, testChainId } from "@framework/constants";

export class CreateTransactionHistory1563804040009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.transaction_status_enum AS ENUM (
       'NEW',
       'PENDING',
       'PROCESS',
       'PROCESSED'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.contract_type_enum AS ENUM (
       'CONTRACT_MANAGER',
       'CLAIM',
       'MYSTERY',
       'EXCHANGE',
       'STAKING',
       'VESTING',
       'ERC20_TOKEN',
       'ERC721_TOKEN',
       'ERC721_TOKEN_RANDOM',
       'ERC998_TOKEN',
       'ERC998_TOKEN_RANDOM',
       'ERC1155_TOKEN',
       'METADATA',
       'LOTTERY',
       'LOOT',
       'RAFFLE',
       'PONZI',
       'WAIT_LIST',
       'PAYMENT_SPLITTER',
       'WRAPPER',
       'VRF',
       'VRF_SUB'
      );
    `);

    const table = new Table({
      name: `${ns}.transactions`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "chain_id",
          type: "int",
          default: testChainId,
        },
        {
          name: "transaction_hash",
          type: "varchar",
        },
        {
          name: "block_number",
          type: "int",
        },
        {
          name: "transaction_index",
          type: "int",
        },
        {
          name: "log_index",
          type: "int",
        },
        {
          name: "transaction_status",
          type: `${ns}.transaction_status_enum`,
          default: "'NEW'",
        },
        {
          name: "contract_type",
          type: `${ns}.contract_type_enum`,
        },
        {
          name: "log_data",
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
    await queryRunner.dropTable(`${ns}.transaction`);
    await queryRunner.query(`DROP TYPE ${ns}.transaction_status_enum;`);
  }
}
