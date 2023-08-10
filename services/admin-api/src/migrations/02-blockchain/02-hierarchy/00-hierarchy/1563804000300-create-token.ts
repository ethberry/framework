import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class CreateToken1563804000300 implements MigrationInterface {
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
          name: "metadata",
          type: "json",
        },
        {
          name: "image_url",
          type: "varchar",
          isNullable: true,
        },
        {
          name: "royalty",
          type: "int",
          default: 0,
        },
        {
          name: "cid",
          type: "varchar",
          isNullable: true,
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

    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 50000000, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.token`);
    await queryRunner.query(`DROP TYPE ${ns}.token_status_enum;`);
  }
}
