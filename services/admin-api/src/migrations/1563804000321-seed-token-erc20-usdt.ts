import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedTokenErc20USDTAt1563804000321 implements MigrationInterface {
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
        12050101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        120501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        22050101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        220501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        32050101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        320501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        42050101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        420501,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
