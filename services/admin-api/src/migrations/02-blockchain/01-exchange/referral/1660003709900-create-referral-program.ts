import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateReferralProgramAt1660003709900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // DROP OLD TABLE
    await queryRunner.query(`DROP TABLE IF EXISTS ${ns}.referral_program CASCADE;`);

    await queryRunner.query(`
      CREATE TYPE ${ns}.referral_program_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.referral_program`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "level",
          type: "int",
        },
        {
          name: "share",
          type: "int",
        },
        {
          name: "merchant_id",
          type: "int",
        },
        {
          name: "strict",
          type: "boolean",
          default: false,
        },
        {
          name: "referral_program_status",
          type: `${ns}.referral_program_status_enum`,
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
    await queryRunner.dropTable(`${ns}.referral_program`);
    await queryRunner.query(`DROP TYPE ${ns}.referral_program_status_enum;`);
  }
}
