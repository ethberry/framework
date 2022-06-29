import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateAirdropTable1563804040410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.airdrop_status_enum AS ENUM (
        'NEW',
        'REDEEMED',
        'UNPACKED'
      );
    `);

    const table = new Table({
      name: `${ns}.airdrop`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "account",
          type: "varchar",
        },
        {
          name: "uni_template_id",
          type: "int",
        },
        {
          name: "uni_token_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "airdrop_status",
          type: `${ns}.airdrop_status_enum`,
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
          columnNames: ["uni_template_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.uni_template`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["uni_token_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.uni_token`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.air_drop`);
  }
}
