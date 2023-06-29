import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";
import { addDays, subDays } from "date-fns";

import { ns } from "@framework/constants";

const getNumbers = (selected = [0, 1, 2, 3, 5, 8]) => {
  const numbers: Array<boolean> = new Array(36).fill(false);
  selected.forEach(s => {
    numbers[s] = true;
  });
  return `{${numbers.join(",")}}`;
};

export class SeedLotteryRoundAt1660436476120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102220001
      ), (
        102220002
      ), (
        102220003
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102220001
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102220002
      ), (
        'ERC20',
        10201,
        1020101, -- Space Credits
        '${WeiPerEther.toString()}',
        102220003
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.lottery_round (
        id,
        numbers,
        round_id,
        contract_id,
        ticket_contract_id,
        price_id,
        max_tickets,
        start_timestamp,
        end_timestamp,
        created_at,
        updated_at
      ) VALUES (
        1,
        '${getNumbers()}',
        '1',
        122,
        12201,
        102220001,
        0,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        '${getNumbers()}',
        '2',
        122,
        12201,
        102220002,
        0,
        '${subDays(now, 1).toISOString()}',
        '${addDays(now, 1).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        null,
        '3',
        122,
        12201,
        102220002,
        5,
        '${addDays(now, 1).toISOString()}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.lottery_round RESTART IDENTITY CASCADE;`);
  }
}
