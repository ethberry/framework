import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateStakingRewardTable1654751224240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.staking_reward`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "token_type",
          type: `${ns}.token_type_enum`,
          default: "'NATIVE'",
        },
        {
          name: "collection",
          type: "int",
        },
        {
          name: "token_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "amount",
          type: "uint256",
          isNullable: true,
        },
        {
          name: "staking_id",
          type: "int",
        },
      ],
      foreignKeys: [
        {
          columnNames: ["staking_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.staking`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking_reward`);
  }
}
