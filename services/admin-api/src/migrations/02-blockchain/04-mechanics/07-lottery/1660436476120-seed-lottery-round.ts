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
    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        1073001
      ), (
        1073002
      ), (
        1073003
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
        1020101, -- space credit
        '${WeiPerEther.toString()}',
        1073001
      ), (
        'ERC20',
        10201,
        1020101, -- space credit
        '${WeiPerEther.toString()}',
        1073002
      ), (
        'ERC20',
        10201,
        1020101, -- space credit
        '${WeiPerEther.toString()}',
        1073003
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.lottery_round (
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
        '${getNumbers()}',
        '1',
        21,
        12101,
        1073001,
        0,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${getNumbers()}',
        '2',
        21,
        12101,
        1073002,
        0,
        '${subDays(now, 1).toISOString()}',
        '${addDays(now, 1).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${getNumbers()}',
        '3',
        21,
        12101,
        1073003,
        5,
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
