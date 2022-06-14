import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc998TokenHistoryTable1563804021290 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc998_token_event_enum AS ENUM (
        'Approval',
        'ApprovalForAll',
        'DefaultRoyaltyInfo',
        'MintRandom',
        'Paused',
        'RandomRequest',
        'RedeemAirdrop',
        'RoleAdminChanged',
        'RoleGranted',
        'RoleRevoked',
        'TokenRoyaltyInfo',
        'Transfer',
        'UnpackAirdrop',
        'UnpackDropbox',
        'Unpaused'
      );
    `);

    const table = new Table({
      name: `${ns}.erc998_token_history`,
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
          type: `${ns}.erc998_token_event_enum`,
        },
        {
          name: "event_data",
          type: "json",
        },
        {
          name: "erc998_token_id",
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
          columnNames: ["erc998_token_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc998_token`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.erc998_token_history`);
    await queryRunner.query(`DROP TYPE ${ns}.erc998_token_event_enum;`);
  }
}
