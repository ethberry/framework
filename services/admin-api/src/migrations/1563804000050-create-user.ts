import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateUser1563804000050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.user_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.user_role_enum AS ENUM (
        'USER',
        'ADMIN'
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
          name: "sub",
          type: "varchar",
        },
        {
          name: "display_name",
          type: "varchar",
          default: "''",
        },
        {
          name: "email",
          type: "varchar",
          default: "''",
        },
        {
          name: "image_url",
          type: "varchar",
          default: "''",
        },
        {
          name: "comment",
          type: "varchar",
          default: "''",
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
          name: "wallet",
          type: "varchar",
          isNullable: true,
        },
        {
          name: "chain_id",
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
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.user`);
    await queryRunner.query(`DROP TYPE ${ns}.user_status_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.user_role_enum;`);
  }
}
