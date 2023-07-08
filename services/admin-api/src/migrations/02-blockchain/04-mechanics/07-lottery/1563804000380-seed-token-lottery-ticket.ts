import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";

export class SeedTokenLotteryTicketAt1563804000380 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.token (
        id,
        metadata,
        royalty,
        token_id,
        token_status,
        template_id,
        created_at,
        updated_at
      ) VALUES (
        123010101,
        '${JSON.stringify({
          ROUND: "101",
          NUMBERS: "1108320851738", // 10,20 ???
        })}',
        100,
        '1',
        'MINTED',
        1230101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        123010102,
        '${JSON.stringify({
          ROUND: "102",
          NUMBERS: "1108320851738", // 10,20
        })}',
        100,
        '2',
        'MINTED',
        1230101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        123010103,
        '${JSON.stringify({
          ROUND: "103",
          NUMBERS: "1108320851738", // 10,20
        })}',
        100,
        '3',
        'MINTED',
        1230101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        123010104,
        '${JSON.stringify({
          ROUND: "101",
          NUMBERS: "1108320851738", // 10,20
        })}',
        100,
        '4',
        'MINTED',
        1230101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        123010105,
        '${JSON.stringify({
          ROUND: "101",
          NUMBERS: "1108320851738", // 10,20
        })}',
        100,
        '5',
        'MINTED',
        1230101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
