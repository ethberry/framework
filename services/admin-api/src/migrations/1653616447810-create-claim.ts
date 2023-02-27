import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateClaim1653616447810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.claim_status_enum AS ENUM (
        'NEW',
        'REDEEMED',
        'UNPACKED',
        'EXPIRED'
      );
    `);

    const table = new Table({
      name: `${ns}.claim`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "account",
          type: "varchar",
        },
        {
          name: "item_id",
          type: "int",
        },
        {
          name: "claim_status",
          type: `${ns}.claim_status_enum`,
          default: "'NEW'",
        },
        {
          name: "signature",
          type: "varchar",
        },
        {
          name: "nonce",
          type: "varchar",
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
      ],
    });

    await queryRunner.createTable(table, true);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_expired_claims() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
        BEGIN
          UPDATE ${ns}.claim SET claim_status='EXPIRED' WHERE end_timestamp != to_timestamp(0) AND end_timestamp < NOW() AND claim_status='NEW';
          RETURN NEW;
        END;
      $$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE TRIGGER update_expired_claims_trigger
      BEFORE INSERT OR UPDATE OR DELETE ON ${ns}.claim
      EXECUTE PROCEDURE update_expired_claims();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.claim`);
    await queryRunner.query("DROP FUNCTION update_expired_claims();");
  }
}
