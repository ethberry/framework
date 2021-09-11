import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@gemunion/framework-constants-misc";

export class CreateAuthTable1602117863296 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.auth`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "refresh_token",
          type: "varchar",
        },
        {
          name: "refresh_token_expires_at",
          type: "bigint",
        },
        {
          name: "ip",
          type: "varchar",
          default: "'0.0.0.0'",
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
      CREATE OR REPLACE FUNCTION delete_expired_auth() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
        BEGIN
          DELETE FROM ${ns}.auth WHERE created_at < NOW() - INTERVAL '30 days';
          RETURN NEW;
        END;
      $$;
    `);

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS delete_expired_auth_trigger ON ${ns}.auth;
      CREATE TRIGGER delete_expired_auth_trigger
      AFTER INSERT ON ${ns}.auth
      EXECUTE PROCEDURE delete_expired_auth()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.auth`);
    await queryRunner.query("DROP FUNCTION delete_expired_auth();");
  }
}
