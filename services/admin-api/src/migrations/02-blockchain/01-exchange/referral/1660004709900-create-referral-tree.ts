import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateReferralTreeAt1660004709900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // DROP OLD TABLE
    await queryRunner.query(`DROP TABLE IF EXISTS ${ns}.referral_tree CASCADE;`);
    const table = new Table({
      name: `${ns}.referral_tree`,
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
          name: "wallet",
          type: "varchar",
        },
        {
          name: "referral",
          type: "varchar",
        },
        {
          name: "merchant_id",
          type: "int",
        },
        {
          name: "temp",
          type: "bool",
          default: false,
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
    await queryRunner.dropTable(`${ns}.referral_tree`);
  }
}
