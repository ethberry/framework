import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@gemunionstudio/framework-constants-misc";

export class AddPageTable1625271343228 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.page_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.page`,
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
          name: "page_status",
          type: `${ns}.page_status_enum`,
        },
        {
          name: "slug",
          type: "varchar",
          isUnique: true,
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
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.page`);
    await queryRunner.query(`DROP TYPE ${ns}.page_status_enum;`);
  }
}
