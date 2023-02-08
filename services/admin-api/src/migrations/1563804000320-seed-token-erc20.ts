import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedTokenErc20At1563804000320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const defaultJSON = JSON.stringify({});

    await queryRunner.query(`
      INSERT INTO ${ns}.token (
        id,
        attributes,
        royalty,
        token_id,
        token_status,
        template_id,
        created_at,
        updated_at
      ) VALUES (
        12010101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        120101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        12020101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        120201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        12030101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        120301,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        12040101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        120401,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
