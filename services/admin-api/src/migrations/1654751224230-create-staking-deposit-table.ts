import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateStakingDepositTable1654751224230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.staking_deposit`,
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
          name: "token",
          type: "int",
        },
        {
          name: "criteria",
          type: "varchar",
          isNullable: true,
        },
        {
          name: "amount",
          type: "varchar",
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
    await queryRunner.dropTable(`${ns}.staking_deposit`);
  }
}
