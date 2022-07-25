import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateToken1563804000310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.token_status_enum AS ENUM (
        'MINTED',
        'BURNED'
      );
    `);

    const table = new Table({
      name: `${ns}.token`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "attributes",
          type: "json",
        },
        {
          name: "royalty",
          type: "int",
          default: 0,
        },
        {
          name: "token_id",
          type: "uint256",
        },
        {
          name: "token_status",
          type: `${ns}.token_status_enum`,
          default: "'MINTED'",
        },
        {
          name: "template_id",
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
          columnNames: ["template_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.template`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.token`);
    await queryRunner.query(`DROP TYPE ${ns}.token_status_enum;`);
  }
}
