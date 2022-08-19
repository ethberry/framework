import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceErc1155At1563804020450 implements MigrationInterface {
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
        100,
        501001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        501002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        501003,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        504001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        504002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        504003,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        100,
        511001,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc1155_balance RESTART IDENTITY CASCADE;`);
  }
}
