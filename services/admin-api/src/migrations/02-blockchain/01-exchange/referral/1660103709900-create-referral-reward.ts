import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateReferralRewardAt1660103709900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.referral_reward`,
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
          name: "referrer",
          type: "varchar",
        },
        {
          name: "share",
          type: "int",
          isNullable: true,
        },
        {
          name: "ref_program_id",
          type: "int",
        },
        {
          name: "contract_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "price_id",
          type: "bigint",
        },
        {
          name: "item_id",
          type: "bigint",
          isNullable: true,
        },
        {
          name: "history_id",
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
          columnNames: ["contract_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.contract`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["price_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["item_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["history_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.event_history`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["ref_program_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.referral_program`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.referral_reward`);
  }
}
