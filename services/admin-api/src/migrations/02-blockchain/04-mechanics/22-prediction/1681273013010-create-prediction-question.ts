import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { NodeEnv } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class CreatePredictionQuestion1681273013010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.prediction_question_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.prediction_question_result_enum AS ENUM (
        'YES',
        'NO',
        'DRAW',
        'TECH'
      );
    `);

    const table = new Table({
      name: `${ns}.prediction_question`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "contract_id",
          type: "int",
        },
        {
          name: "title",
          type: "varchar",
        },
        {
          name: "description",
          type: "json",
        },
        {
          name: "merchant_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "price_id",
          type: "bigint",
          isNullable: true,
        },
        {
          name: "start_timestamp",
          type: "timestamptz",
          isNullable: true,
        },
        {
          name: "end_timestamp",
          type: "timestamptz",
          isNullable: true,
        },
        {
          name: "max_votes",
          type: "int",
        },
        {
          name: "question_status",
          type: `${ns}.prediction_question_status_enum`,
          default: "'ACTIVE'",
        },
        {
          name: "question_result",
          type: `${ns}.prediction_question_result_enum`,
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
          columnNames: ["contract_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.contract`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["merchant_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.merchant`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["price_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.asset`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);

    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    await queryRunner.query(`SELECT setval('${ns}.prediction_rule_id_seq', 5000, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.prediction_question`);
    await queryRunner.query(`DROP TYPE ${ns}.prediction_question_status_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.prediction_question_answer_enum;`);
  }
}
