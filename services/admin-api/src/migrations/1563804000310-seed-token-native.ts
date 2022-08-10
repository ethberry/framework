import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedTokenNativeAt1563804000310 implements MigrationInterface {
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
        11001,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        12001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11002,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        12002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11003,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        12003,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        11004,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        12004,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 11004, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
