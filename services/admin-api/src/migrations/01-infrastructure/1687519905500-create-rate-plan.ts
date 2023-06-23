import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateRatePlan1687519905500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.rate_plan_enum AS ENUM (
        'BRONZE',
        'SILVER',
        'GOLD'
      );
    `);

    const table = new Table({
      name: `${ns}.rate_plan`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "rate_plan",
          type: `${ns}.rate_plan_enum`,
          default: "'BRONZE'",
        },
        {
          name: "contract_module",
          type: `${ns}.contract_module_enum`,
        },
        {
          name: "contract_type",
          type: `${ns}.token_type_enum`,
          isNullable: true,
        },
        {
          name: "amount",
          type: "int",
          default: 0,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.rate_plan`);
    await queryRunner.query(`DROP TYPE ${ns}.rate_plan_enum;`);
  }
}
