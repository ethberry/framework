import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedTokenErc20WETHAt1563804000322 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
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
        102160101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        1021601,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        202160101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        2021601,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        302160101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        3021601,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        402160101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        4021601,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
