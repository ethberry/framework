import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@framework/constants";

export class CreateAchievementRule1681273013010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.achievement_type_enum AS ENUM (
        'MARKETPLACE',
        'CRAFT',
        'COLLECTION',
        'ECOMMERCE'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.achievement_status_enum AS ENUM (
        'NEW',
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.achievement_rule`,
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
          name: "achievement_type",
          type: `${ns}.achievement_type_enum`,
        },
        {
          name: "event_type",
          type: `${ns}.event_history_event_enum`,
          isNullable: true,
        },
        {
          name: "contract_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "item_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "achievement_status",
          type: `${ns}.achievement_status_enum`,
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
          columnNames: ["item_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.achievement_rule`);
  }
}
