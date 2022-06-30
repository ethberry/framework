import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateAccessControl1653616447230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.access_control_roles_enum AS ENUM (
        'DEFAULT_ADMIN_ROLE',
        'MINTER_ROLE',
        'PAUSER_ROLE',
        'SNAPSHOT_ROLE',
        'PREDICATE_ROLE',
        'DEPOSITOR_ROLE'
      );
    `);

    const table = new Table({
      name: `${ns}.access_control`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "address",
          type: "varchar",
        },
        {
          name: "account",
          type: "varchar",
        },
        {
          name: "role",
          type: `${ns}.access_control_roles_enum`,
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
    await queryRunner.dropTable(`${ns}.access_control`);
    await queryRunner.query(`DROP TYPE ${ns}.access_control_roles_enum;`);
  }
}
