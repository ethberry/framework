import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@framework/constants";

export class CreateParameter1593408358870 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const table = new Table({
      name: `${ns}.parameter`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "parameter_name",
          type: "varchar",
        },
        {
          name: "parameter_type",
          type: "varchar",
        },
        {
          name: "parameter_value",
          type: "varchar",
          isNullable: true,
        },
        {
          name: "parameter_extra",
          type: "varchar",
          isNullable: true,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.parameter`);
  }
}
