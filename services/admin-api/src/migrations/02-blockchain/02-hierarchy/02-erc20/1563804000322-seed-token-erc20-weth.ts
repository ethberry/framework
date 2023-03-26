import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedTokenErc20WETHAt1563804000322 implements MigrationInterface {
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
        12160101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        121601,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        22160101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        221601,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        32160101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        321601,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        42160101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        421601,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
