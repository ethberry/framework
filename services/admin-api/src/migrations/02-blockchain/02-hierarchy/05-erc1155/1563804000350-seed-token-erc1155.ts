import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";

export class SeedTokenErc1155At1563804000350 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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
        15010101,
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        150101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        15010201,
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        150102,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        15010301,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        150103,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        15010401,
        '${defaultJSON}',
        100,
        '4',
        'MINTED',
        150104,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        15010501,
        '${defaultJSON}',
        100,
        '5',
        'MINTED',
        150105,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        15040101,
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        150401,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        15040201,
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        150402,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      ), (
        15040301,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        150403,
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        25010101,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        250101,
        '${subDays(now, 30).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
