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
        101001,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        101001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        102001,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        102001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        111001,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        111001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        121001,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        121001,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 121001, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
