import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateMerchant1563803000110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.merchant_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE',
        'PENDING'
      );
    `);

    const table = new Table({
      name: `${ns}.merchant`,
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
          name: "email",
          type: "varchar",
          isUnique: true,
        },
        {
          name: "api_key",
          type: "uuid",
          default: "uuid_generate_v4()",
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
          name: "merchant_status",
          type: `${ns}.merchant_status_enum`,
        },
        {
          name: "wallet",
          type: "varchar",
          isNullable: false, // always needed
          isUnique: true,
        },
        {
          name: "social",
          type: "json",
          default: "'{}'",
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
    await queryRunner.dropTable(`${ns}.merchant`);
    await queryRunner.query(`DROP TYPE ${ns}.merchant_status_enum;`);
  }
}
