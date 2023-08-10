import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTokenRaffleTicketAt1685961134380 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
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
        121010101,
        '${JSON.stringify({
          ROUND: "101",
        })}',
        100,
        '1',
        'MINTED',
        1210101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        121010102,
        '${JSON.stringify({
          ROUND: "101",
        })}',
        100,
        '2',
        'MINTED',
        1210101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        121010103,
        '${JSON.stringify({
          ROUND: "101",
        })}',
        100,
        '3',
        'MINTED',
        1210101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        121010104,
        '${JSON.stringify({
          ROUND: "101",
        })}',
        100,
        '4',
        'MINTED',
        1210101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        121010105,
        '${JSON.stringify({
          ROUND: "101",
        })}',
        100,
        '5',
        'MINTED',
        1210101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
