import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedRaffleTicketsAt1685961136140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.raffle_ticket (
        account,
        round_id,
        token_id,
        amount,
        created_at,
        updated_at
      ) VALUES (
        '${wallets[0]}',
        1,
        111010101,
        '${WeiPerEther * 5n}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        1,
        111010101,
        '${WeiPerEther}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        1,
        111010101,
        '${WeiPerEther}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        1,
        111010101,
        '${WeiPerEther}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        1,
        111010101,
        '${WeiPerEther}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        1,
        111010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        1,
        111010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        2,
        111010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        2,
        111010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        2,
        111010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[0]}',
        3,
        111010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[1]}',
        3,
        111010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallets[2]}',
        3,
        111010101,
        '0',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.raffle_ticket RESTART IDENTITY CASCADE;`);
  }
}
