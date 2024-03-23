import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@framework/constants";

export class CreatePredictionAnswer1681273013050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.prediction_answer_answer_enum AS ENUM (
        'YES',
        'NO',
        'DRAW',
        'TECH'
      );
    `);

    const table = new Table({
      name: `${ns}.prediction_answer`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "question_id",
          type: "int",
        },
        {
          name: "user_id",
          type: "int",
        },
        {
          name: "answer",
          type: `${ns}.prediction_answer_answer_enum`,
          default: "'YES'",
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
          columnNames: ["question_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.prediction_question`,
          onDelete: "CASCADE",
        },
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
    await queryRunner.dropTable(`${ns}.prediction_answer`);
    await queryRunner.query(`DROP TYPE ${ns}.prediction_answer_answer_enum;`);
  }
}
