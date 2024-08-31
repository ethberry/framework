import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet, NodeEnv } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedAccessControlLotteryAt1660436476330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const lotteryAddr = process.env.LOTTERY_ADDR;

    await queryRunner.query(`
      INSERT INTO ${ns}.access_control (
        address,
        account,
        role,
        created_at,
        updated_at
      ) VALUES (
        '${lotteryAddr}',
        '${wallet}',
        'DEFAULT_ADMIN_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${lotteryAddr}',
        '${wallet}',
        'PAUSER_ROLE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.access_list RESTART IDENTITY CASCADE;`);
  }
}
