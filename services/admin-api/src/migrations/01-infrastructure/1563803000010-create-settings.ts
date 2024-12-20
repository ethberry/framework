import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateSettings1563803000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.settings`,
      columns: [
        {
          name: "key",
          type: "varchar",
          isPrimary: true,
          isUnique: true,
        },
        {
          name: "value",
          type: "json",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.settings`);
  }
}
