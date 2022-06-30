import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedTokenErc721At1563804000330 implements MigrationInterface {
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
        20101,
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        20101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20102,
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        20102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20103,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        30103,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20201,
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        20201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20202,
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        20202,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20203,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        20203,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 20203, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
