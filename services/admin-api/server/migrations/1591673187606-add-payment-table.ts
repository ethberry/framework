import {MigrationInterface, QueryRunner, Table} from "typeorm";
import {ns} from "@trejgun/solo-constants-misc";

export class AddPaymentTable1591673187606 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.payment_source_enum AS ENUM (
        'LIQPAY'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.payment_currency_enum AS ENUM (
        'UAH'
      );
    `);

    const table = new Table({
      name: `${ns}.payment`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "user_id",
          type: "int",
        },
        {
          name: "amount",
          type: "int",
        },
        {
          name: "currency",
          type: `${ns}.payment_currency_enum`,
        },
        {
          name: "source",
          type: `${ns}.payment_source_enum`,
        },
        {
          name: "receipt",
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
      foreignKeys: [
        {
          columnNames: ["user_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.user`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.subscription`);
    await queryRunner.query(`DROP TYPE ${ns}.payment_source_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.payment_currency_enum;`);
  }
}
