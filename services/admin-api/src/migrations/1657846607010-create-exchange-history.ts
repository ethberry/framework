import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateExchangeHistory1657846607010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TYPE ${ns}.exchange_event_enum AS ENUM ('Transaction');`);

    const table = new Table({
      name: `${ns}.exchange_history`,
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
          type: `${ns}.exchange_event_enum`,
        },
        {
          name: "event_data",
          type: "json",
        },
        {
          name: "template_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "claim_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "craft_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "grade_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "lootbox_id",
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
          referencedTableName: `${ns}.claim`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["claim_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.claim`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["craft_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.craft`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["grade_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.grade`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["lootbox_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.grade`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.exchange_history`);
    await queryRunner.query(`DROP TYPE ${ns}.exchange_event_enum;`);
  }
}
