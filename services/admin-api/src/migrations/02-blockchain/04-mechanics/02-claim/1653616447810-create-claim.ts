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

    await queryRunner.query(`
      CREATE TYPE ${ns}.claim_type_enum AS ENUM (
        'TOKEN',
        'VESTING'
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
          name: "parameters",
          type: "json",
          default: "'{}'",
        },
        {
          name: "claim_status",
          type: `${ns}.claim_status_enum`,
          default: "'NEW'",
        },
        {
          name: "claim_type",
          type: `${ns}.claim_type_enum`,
          default: "'TOKEN'",
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
          name: "merchant_id",
          type: "int",
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
          columnNames: ["merchant_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.merchant`,
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
      AFTER INSERT ON ${ns}.claim
      EXECUTE PROCEDURE update_expired_claims();
    `);

    if (process.env.NODE_ENV === "production") {
      return;
    }

    await queryRunner.query(`SELECT setval('${ns}.claim_id_seq', 5000000, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.claim`);
    await queryRunner.query(`DROP TYPE ${ns}.claim_status_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.claim_type_enum;`);
    await queryRunner.query("DROP FUNCTION update_expired_claims();");
  }
}
