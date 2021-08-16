import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@gemunion/framework-constants-misc";

export class AddUserTable1563804021040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.user_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE',
        'PENDING'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.user_role_enum AS ENUM (
        'CUSTOMER',
        'ADMIN',
        'MERCHANT'
      );
    `);

    const table = new Table({
      name: `${ns}.user`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "first_name",
          type: "varchar",
        },
        {
          name: "last_name",
          type: "varchar",
        },
        {
          name: "email",
          type: "varchar",
          isUnique: true,
        },
        {
          name: "password",
          type: "varchar",
        },
        {
          name: "phone_number",
          type: "varchar",
        },
        {
          name: "image_url",
          type: "varchar",
        },
        {
          name: "merchant_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "comment",
          type: "varchar",
        },
        {
          name: "language",
          type: `${ns}.language_enum`,
        },
        {
          name: "user_status",
          type: `${ns}.user_status_enum`,
        },
        {
          name: "user_roles",
          type: `${ns}.user_role_enum`,
          isArray: true,
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
          columnNames: ["merchant_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.merchant`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.user`);
    await queryRunner.query(`DROP TYPE ${ns}.user_status_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.user_role_enum;`);
  }
}
