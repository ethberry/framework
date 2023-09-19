import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class CreateTemplate1563804000200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.template_status_enum AS ENUM (
        'ACTIVE',
        'HIDDEN',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.template`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "title",
          type: "varchar",
        },
        {
          name: "description",
          type: "json",
        },
        {
          name: "image_url",
          type: "varchar",
        },
        {
          name: "price_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "cap",
          type: "uint256",
          default: 0,
        },
        {
          name: "amount",
          type: "uint256",
          default: 0,
        },
        {
          name: "cid",
          type: "varchar",
          isNullable: true,
        },
        {
          name: "contract_id",
          type: "int",
        },
        {
          name: "template_status",
          type: `${ns}.template_status_enum`,
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
          columnNames: ["contract_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.contract`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["price_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);

    await queryRunner.query(
      `SELECT setval('${ns}.template_id_seq', ${process.env.NODE_ENV === NodeEnv.production ? 50 : 500000}, true);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.template`);
    await queryRunner.query(`DROP TYPE ${ns}.template_status_enum;`);
  }
}
