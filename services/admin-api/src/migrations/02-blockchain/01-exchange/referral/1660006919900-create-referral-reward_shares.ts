import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateReferralRewardSharesAt1660006919900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.referral_share`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "referrer",
          type: "varchar",
        },
        {
          name: "share",
          type: "int",
        },
        {
          name: "level",
          type: "int",
        },
        {
          name: "reward_id",
          type: "int",
        },
        {
          name: "tree_id",
          type: "int",
        },
        {
          name: "claim_id",
          type: "int",
          isNullable: true,
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
          columnNames: ["reward_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.referral_reward`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["tree_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.referral_tree`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["claim_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.referral_claim`,
          onDelete: "SET NULL",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.referral_share`);
  }
}
