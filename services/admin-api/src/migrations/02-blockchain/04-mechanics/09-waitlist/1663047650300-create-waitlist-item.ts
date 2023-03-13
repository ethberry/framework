import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateWaitlistItem1663047650300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.waitlist_item`,
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
          name: "list_id",
          type: "int",
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
          columnNames: ["list_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.waitlist_list`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.waitlist_item`);
  }
}
