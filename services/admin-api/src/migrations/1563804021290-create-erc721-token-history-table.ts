import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc721TokenHistoryTable1563804021290 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc721_token_event_enum AS ENUM (
        'Transfer',
        'Approval',
        'ApprovalForAll',
        'TokenRoyaltyInfo',
        'DefaultRoyaltyInfo',
        'Redeem',
        'Unpack',
        'UnpackAirdrop',
        'MintRandom',
        'RoleGranted',
        'RoleRevoked',
        'RandomRequest'
      );
    `);

    const table = new Table({
      name: `${ns}.erc721_token_history`,
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
          type: `${ns}.erc721_token_event_enum`,
        },
        {
          name: "event_data",
          type: "json",
        },
        {
          name: "erc721_token_id",
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
          columnNames: ["erc721_token_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc721_token`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.erc721_token_history`);
    await queryRunner.query(`DROP TYPE ${ns}.erc721_token_event_enum;`);
  }
}
