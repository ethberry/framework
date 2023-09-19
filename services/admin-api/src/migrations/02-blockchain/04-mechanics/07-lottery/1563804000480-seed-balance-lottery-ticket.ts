import { MigrationInterface, QueryRunner } from "typeorm";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedBalanceLotteryTicketAt1563804020480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
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
        123010101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        1,
        123010102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        1,
        123010103,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        1,
        123010104,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        1,
        123010105,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
