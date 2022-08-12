import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedTokenErc1155At1563804000350 implements MigrationInterface {
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
        501001,
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        501001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        501002,
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        501002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        501003,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        501003,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        501004,
        '${defaultJSON}',
        100,
        '4',
        'MINTED',
        501004,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        501005,
        '${defaultJSON}',
        100,
        '5',
        'MINTED',
        501005,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        504001,
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        504001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        504002,
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        504002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        504003,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        504003,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        511001,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        511001,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 511001, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
