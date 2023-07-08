import { MigrationInterface, QueryRunner } from "typeorm";
import { ns } from "@framework/constants";

export class SeedGameBalance1686896594710 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.game_balance (
        user_id,
        amount,
        created_at,
        updated_at
      ) VALUES (
        1,
        1000000,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        1000000,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        1000000,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        4,
        1000000,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        5,
        1000000,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        6,
        1000000,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.game_balance RESTART IDENTITY CASCADE;`);
  }
}
