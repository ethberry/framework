import { MigrationInterface, QueryRunner } from "typeorm";

import { NodeEnv, wallets } from "@ethberry/constants";
import { ns } from "@framework/constants";

export class SeedBalanceVestingAt1563804100490 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        created_at,
        updated_at
      ) VALUES (
        '${wallets[0]}',
        1,
        128010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        1,
        128010102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        1,
        128010103,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
