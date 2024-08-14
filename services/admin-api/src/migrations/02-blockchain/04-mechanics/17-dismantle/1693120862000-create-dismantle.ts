import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class CreateDismantle1693120862000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.dismantle_strategy_enum AS ENUM (
        'FLAT',
        'LINEAR',
        'EXPONENTIAL'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.dismantle_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.dismantle`,
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
          name: "rarity_multiplier",
          type: "int",
        },
        {
          name: "dismantle_strategy",
          type: `${ns}.dismantle_strategy_enum`,
        },
        {
          name: "merchant_id",
          type: "int",
        },
        {
          name: "dismantle_status",
          type: `${ns}.dismantle_status_enum`,
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

    await queryRunner.query(`SELECT setval('${ns}.dismantle_id_seq', 5000000, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.dismantle`);
    await queryRunner.query(`DROP TYPE ${ns}.dismantle_status_enum;`);
  }
}
