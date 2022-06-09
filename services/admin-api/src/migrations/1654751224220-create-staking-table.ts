import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateStakingTable1654751224220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.staking_history`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "deposit_type",
          type: "int",
        },
        {
          name: "deposit_token",
          type: "varchar",
        },
        {
          name: "deposit_token_id",
          type: "varchar",
        },
        {
          name: "deposit_amount",
          type: "varchar",
        },
        {
          name: "reward_type",
          type: "int",
        },
        {
          name: "reward_token",
          type: "varchar",
        },
        {
          name: "reward_token_id",
          type: "varchar",
        },
        {
          name: "reward_amount",
          type: "varchar",
        },
        {
          name: "period",
          type: "int",
        },
        {
          name: "penalty",
          type: "int",
        },
        {
          name: "recurrent",
          type: "boolean",
        },
        {
          name: "active",
          type: "boolean",
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
    await queryRunner.dropTable(`${ns}.staking_history`);
  }
}
