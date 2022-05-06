import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc721AuctionTable1646924902900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc721_auction_status_enum AS ENUM (
        'ACTIVE',
        'FINISHED'
      );
    `);

    const table = new Table({
      name: `${ns}.erc721_auction`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "auction_id",
          type: "varchar",
        },
        {
          name: "owner",
          type: "varchar",
        },
        {
          name: "erc721_collection_id",
          type: "int",
        },
        {
          name: "erc721_token_id",
          type: "int",
        },
        {
          name: "start_price",
          type: "uint256",
        },
        {
          name: "buyout_price",
          type: "uint256",
        },
        {
          name: "price",
          type: "uint256",
        },
        {
          name: "bid_step",
          type: "varchar",
        },
        {
          name: "start_timestamp",
          type: "timestamptz",
        },
        {
          name: "finish_timestamp",
          type: "timestamptz",
        },
        {
          name: "auction_status",
          type: `${ns}.erc721_auction_status_enum`,
          default: "'ACTIVE'",
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
          columnNames: ["erc721_collection_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc721_collection`,
          onDelete: "CASCADE",
        },
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
    await queryRunner.dropTable(`${ns}.erc721_auction`);
    await queryRunner.query(`DROP TYPE ${ns}.erc721_auction_status_enum;`);
  }
}
