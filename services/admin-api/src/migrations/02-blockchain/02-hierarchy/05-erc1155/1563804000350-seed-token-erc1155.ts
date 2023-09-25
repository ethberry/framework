import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedTokenErc1155At1563804000350 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const now = new Date();
    const defaultJSON = JSON.stringify({});

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
        105010101, -- gold
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        1050101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        105010201, -- wood
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        1050102,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        105010301, -- iron ore
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        1050103,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        105010401, -- planks
        '${defaultJSON}',
        100,
        '4',
        'MINTED',
        1050104,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        105010501, -- iron ingot
        '${defaultJSON}',
        100,
        '5',
        'MINTED',
        1050105,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        105040101, -- healing potion
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        1050401,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        105040201, -- mana potion
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        1050402,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        105040301, -- antidote
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        1050403,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        105050101, -- chupa-chups
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        1050501,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        205010101, -- bep
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        2050101,
        '${subDays(now, 30).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
