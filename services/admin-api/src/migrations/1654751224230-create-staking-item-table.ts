import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateStakingItemTable1654751224230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.staking_item_type_enum AS ENUM (
        'NATIVE',
        'ERC20',
        'ERC721',
        'ERC1155'
      );
    `);

    const table = new Table({
      name: `${ns}.staking_item`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "item_type",
          type: `${ns}.staking_item_type_enum`,
          default: "'NATIVE'",
        },
        {
          name: "token",
          type: "varchar",
        },
        {
          name: "criteria",
          type: "varchar",
        },
        {
          name: "amount",
          type: "varchar",
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
    await queryRunner.dropTable(`${ns}.staking_item`);
    await queryRunner.query(`DROP TYPE ${ns}.staking_item_type_enum;`);
  }
}
