import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateAirdropTable1563804040410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc721_airdrop_status_enum AS ENUM (
        'NEW',
        'REDEEMED',
        'UNPACKED'
      );
    `);

    const table = new Table({
      name: `${ns}.erc721_airdrop`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "owner",
          type: "varchar",
        },
        {
          name: "erc721_template_id",
          type: "int",
        },
        {
          name: "erc721_token_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "airdrop_status",
          type: `${ns}.erc721_airdrop_status_enum`,
          default: "'NEW'",
        },
        {
          name: "signature",
          type: "varchar",
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
          columnNames: ["erc721_template_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc721_template`,
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
    await queryRunner.dropTable(`${ns}.erc721_air_drop`);
  }
}
