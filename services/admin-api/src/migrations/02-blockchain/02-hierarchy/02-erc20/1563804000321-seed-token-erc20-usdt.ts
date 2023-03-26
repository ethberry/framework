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
        12150101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        121501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        22150101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        221501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        32150101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        321501,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        42150101,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        421501,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
