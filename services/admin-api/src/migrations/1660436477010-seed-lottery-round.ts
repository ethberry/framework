import { MigrationInterface, QueryRunner } from "typeorm";
import { addDays, subDays } from "date-fns";

import { ns } from "@framework/constants";

export const getNumbers = (selected = [0, 1, 2, 3, 5, 8]) => {
  const numbers: Array<boolean> = new Array(36).fill(false);
  selected.forEach(s => {
    numbers[s] = true;
  });
  return `{${numbers.join(",")}}`;
};

export class SeedLotteryRoundAt1660436477010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.lottery_round (
        numbers,
        start_timestamp,
        end_timestamp,
        created_at,
        updated_at
      ) VALUES (
        '${getNumbers()}',
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${getNumbers()}',
        '${subDays(now, 1).toISOString()}',
        '${addDays(now, 1).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${getNumbers()}',
        '${addDays(now, 1).toISOString()}',
        '${addDays(now, 3).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.lottery_round RESTART IDENTITY CASCADE;`);
  }
}
