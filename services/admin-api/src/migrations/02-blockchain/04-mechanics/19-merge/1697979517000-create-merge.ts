import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class CreateMerge1697979517000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.merge_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.merge`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "item_id",
          type: "bigint",
        },
        {
          name: "price_id",
          type: "bigint",
        },
        {
          name: "merchant_id",
          type: "int",
        },
        {
          name: "merge_status",
          type: `${ns}.merge_status_enum`,
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
          columnNames: ["item_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["price_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["merchant_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.merchant`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);

    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    await queryRunner.query(`SELECT setval('${ns}.merge_id_seq', 5000000, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.merge`);
    await queryRunner.query(`DROP TYPE ${ns}.merge_status_enum;`);
  }
}
