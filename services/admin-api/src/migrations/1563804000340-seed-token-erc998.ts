import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedTokenErc998At1563804000340 implements MigrationInterface {
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
        30101,
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        30101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        30102,
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        30101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        30103,
        '${defaultJSON}',
        100,
        '3',
        'BURNED',
        30101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 30103, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
