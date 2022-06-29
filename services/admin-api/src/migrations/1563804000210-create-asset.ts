import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateAsset1563804000210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.asset_type_enum AS ENUM (
        'MARKETPLACE',
        'EXCHANGE',
        'STAKING'
      );
    `);

    const table = new Table({
      name: `${ns}.asset`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "asset_type",
          type: `${ns}.asset_type_enum`,
          default: "'MARKETPLACE'",
        },
        {
          name: "external_id",
          type: "int",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.asset`);
  }
}
