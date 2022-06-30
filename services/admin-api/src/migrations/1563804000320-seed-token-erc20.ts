import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedUniTokenErc20At1563804000320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const defaultJSON = JSON.stringify({});

    await queryRunner.query(`
      INSERT INTO ${ns}.uni_token (
        id,
        attributes,
        royalty,
        token_id,
        token_status,
        uni_template_id,
        created_at,
        updated_at
      ) VALUES (
        10001,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        10001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10002,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        10002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10003,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        10003,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10004,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        10004,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10005,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        10005,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        10006,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        10006,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.uni_token_id_seq', 10006, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.uni_token RESTART IDENTITY CASCADE;`);
  }
}
