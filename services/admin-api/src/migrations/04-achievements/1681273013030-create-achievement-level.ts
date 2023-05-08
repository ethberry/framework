import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@framework/constants";

export class CreateAchievementLevel1681273013030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.achievement_level`,
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
          name: "item_id",
          type: "int",
        },
        {
          name: "achievement_rule_id",
          type: "int",
        },
        {
          name: "amount",
          type: "int",
        },
        {
          name: "attributes",
          type: "json",
        },
        {
          name: "start_timestamp",
          type: "timestamptz",
        },
        {
          name: "end_timestamp",
          type: "timestamptz",
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
          columnNames: ["achievement_rule_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.achievement_rule`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.achievement_level`);
  }
}
