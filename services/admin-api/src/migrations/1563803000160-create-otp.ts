import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateOtp1563803000160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.otp_type_enum AS ENUM (
        'EMAIL',
        'PASSWORD'
      );
    `);

    const table = new Table({
      name: `${ns}.otp`,
      columns: [
        {
          name: "uuid",
          type: "uuid",
          default: "uuid_generate_v4()",
          isPrimary: true,
        },
        {
          name: "otp_type",
          type: `${ns}.otp_type_enum`,
        },
        {
          name: "data",
          type: `json`,
          isNullable: true,
        },
        {
          name: "user_id",
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
          columnNames: ["user_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.user`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION delete_expired_otps() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
        BEGIN
          DELETE FROM ${ns}.otp WHERE created_at < NOW() - INTERVAL '1 hour';
          RETURN NEW;
        END;
      $$;
    `);

    await queryRunner.query(`
      CREATE TRIGGER delete_expired_otps_trigger
      AFTER INSERT ON ${ns}.otp
      EXECUTE PROCEDURE delete_expired_otps()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.otp`);
    await queryRunner.query(`DROP TYPE ${ns}.otp_type_enum;`);
    await queryRunner.query("DROP FUNCTION delete_expired_otps();");
  }
}
