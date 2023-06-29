import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";
import { addDays, subDays } from "date-fns";

import { ns } from "@framework/constants";

export class SeedRaffleRoundAt1685961136120 implements MigrationInterface {
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
        102210001
      ), (
        102210002
      ), (
        102210003
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
      INSERT INTO ${ns}.raffle_round (
        number,
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
        '1',
        '1',
        12201,
        12101,
        102210001,
        0,
        '${subDays(now, 3).toISOString()}',
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '2',
        '2',
        12201,
        12101,
        102210002,
        0,
        '${subDays(now, 1).toISOString()}',
        '${addDays(now, 1).toISOString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        null,
        '3',
        12201,
        12101,
        102210003,
        5,
        '${addDays(now, 1).toISOString()}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.raffle_round_id_seq', 50000, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.raffle_round RESTART IDENTITY CASCADE;`);
  }
}
