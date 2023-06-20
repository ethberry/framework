import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";

export class SeedTokenLotteryTicketAt1563804000380 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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
        122010101,
        '${JSON.stringify({
          ROUND: "1",
          NUMBERS: "0x0000000000000000000000000000000000000000000000000000000000100400", // 10,20
        })}',
        100,
        '1',
        'MINTED',
        1220101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        122010102,
        '${JSON.stringify({
          ROUND: "2",
          NUMBERS: "0x0000000000000000000000000000000000000000000000000000000000100400", // 10,20
        })}',
        100,
        '2',
        'MINTED',
        1220101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        122010103,
        '${JSON.stringify({
          ROUND: "3",
          NUMBERS: "0x0000000000000000000000000000000000000000000000000000000000100400", // 10,20
        })}',
        100,
        '3',
        'MINTED',
        1220101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        122010104,
        '${JSON.stringify({
          ROUND: "1",
          NUMBERS: "0x0000000000000000000000000000000000000000000000000000000000100400", // 10,20
        })}',
        100,
        '4',
        'MINTED',
        1220101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        122010105,
        '${JSON.stringify({
          ROUND: "1",
          NUMBERS: "0x0000000000000000000000000000000000000000000000000000000000100400", // 10,20
        })}',
        100,
        '5',
        'MINTED',
        1220101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
