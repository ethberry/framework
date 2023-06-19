import { MigrationInterface, QueryRunner } from "typeorm";
import { addDays, subDays } from "date-fns";

import { ns } from "@framework/constants";

export class SeedRaffleRoundAt1685961136120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.raffle_round (
        number,
        round_id,
        contract_id,
        start_timestamp,
        end_timestamp,
        created_at,
        updated_at
      ) VALUES (
        '1',
        '1',
        21,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '2',
        '2',
        21,
        '${subDays(now, 1).toISOString()}',
        '${addDays(now, 1).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        null,
        '3',
        21,
        '${addDays(now, 1).toISOString()}',
        '${addDays(now, 3).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.raffle_round RESTART IDENTITY CASCADE;`);
  }
}
