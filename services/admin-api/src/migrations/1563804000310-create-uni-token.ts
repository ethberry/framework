import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateUniToken1563804000310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.uni_token_status_enum AS ENUM (
        'MINTED',
        'BURNED'
      );
    `);

    const table = new Table({
      name: `${ns}.uni_token`,
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
        },
        {
          name: "token_id",
          type: "uint256",
        },
        {
          name: "token_status",
          type: `${ns}.uni_token_status_enum`,
          default: "'MINTED'",
        },
        {
          name: "uni_template_id",
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
          columnNames: ["uni_template_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.uni_template`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.uni_token`);
    await queryRunner.query(`DROP TYPE ${ns}.uni_token_status_enum;`);
  }
}
