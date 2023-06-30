import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateUser1563803000130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.user_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.user_role_enum AS ENUM (
        'SUPER',
        'ADMIN',
        'OWNER',
        'MANAGER',
        'CUSTOMER'
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
          name: "merchant_id",
          type: "int",
          isNullable: true,
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
          name: "gender",
          type: `${ns}.gender_enum`,
          isNullable: true,
        },
        {
          name: "country",
          type: `${ns}.country_enum`,
          isNullable: true,
        },
        {
          name: "wallet",
          type: "varchar",
          isNullable: true,
          isUnique: true,
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
