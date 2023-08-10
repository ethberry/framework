import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class CreateMysterybox1653616447910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    await queryRunner.query(`
      CREATE TYPE ${ns}.mystery_box_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.mysterybox`,
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
          name: "item_id",
          type: "int",
        },
        {
          name: "template_id",
          type: "int",
        },
        {
          name: "mystery_box_status",
          type: `${ns}.mystery_box_status_enum`,
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
    await queryRunner.dropTable(`${ns}.mysterybox`);
    await queryRunner.query(`DROP TYPE ${ns}.mystery_box_status_enum;`);
  }
}
