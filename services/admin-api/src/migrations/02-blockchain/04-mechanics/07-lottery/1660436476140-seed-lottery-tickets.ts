import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

const getNumbers = (selected = [0, 1, 2, 3, 5, 8]) => {
  const numbers: Array<boolean> = new Array(36).fill(false);
  selected.forEach(s => {
    numbers[s] = true;
  });
  return `{${numbers.join(",")}}`;
};

export class SeedLotteryTicketsAt1660436476140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.lottery_ticket (
        account,
        numbers,
        round_id,
        token_id,
        amount,
        created_at,
        updated_at
      ) VALUES (
        '${wallets[0]}',
        '${getNumbers()}',
        1,
        121010101,
        '${constants.WeiPerEther.mul(5).toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${getNumbers([1, 2, 3, 4, 5, 6])}',
        1,
        121010101,
        '${constants.WeiPerEther.toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${getNumbers([11, 12, 13, 14, 15, 16])}',
        1,
        121010101,
        '${constants.WeiPerEther.toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${getNumbers([21, 22, 23, 24, 25, 26])}',
        1,
        121010101,
        '${constants.WeiPerEther.toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${getNumbers([31, 32, 33, 34, 35, 36])}',
        1,
        121010101,
        '${constants.WeiPerEther.toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        '${getNumbers()}',
        1,
        121010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        '${getNumbers()}',
        1,
        121010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${getNumbers()}',
        2,
        121010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        '${getNumbers()}',
        2,
        121010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        '${getNumbers()}',
        2,
        121010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        '${getNumbers()}',
        3,
        121010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        '${getNumbers()}',
        3,
        121010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        '${getNumbers()}',
        3,
        121010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.lottery_ticket RESTART IDENTITY CASCADE;`);
  }
}
