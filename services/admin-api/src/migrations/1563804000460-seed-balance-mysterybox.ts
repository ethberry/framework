import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceErcMysteryAt1563804020460 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        1,
        601001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        604001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        605001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        606001,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
