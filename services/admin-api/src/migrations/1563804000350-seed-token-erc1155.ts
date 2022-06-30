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
        40101,
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        40101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40102,
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        40102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40103,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        40103,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40104,
        '${defaultJSON}',
        100,
        '4',
        'MINTED',
        40105,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40105,
        '${defaultJSON}',
        100,
        '5',
        'MINTED',
        40105,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40201,
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        40201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40202,
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        40202,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        40203,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        40203,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 40203, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
