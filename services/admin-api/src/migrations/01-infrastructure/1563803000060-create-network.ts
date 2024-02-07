import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateNetwork1563803000060 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.network`,
      columns: [
        {
          name: "chain_id",
          type: "int",
          isPrimary: true,
          isUnique: true,
        },
        {
          name: "chain_name",
          type: "varchar",
        },
        {
          name: "order",
          type: "int",
        },
        {
          name: "rpc_urls",
          type: "json",
        },
        {
          name: "block_explorer_urls",
          type: "json",
        },
        {
          name: "native_currency",
          type: "json",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.network`);
  }
}
