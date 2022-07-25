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
        15101,
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        15101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15102,
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        15102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15103,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        15103,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15104,
        '${defaultJSON}',
        100,
        '4',
        'MINTED',
        15105,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15105,
        '${defaultJSON}',
        100,
        '5',
        'MINTED',
        15105,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15201,
        '${defaultJSON}',
        100,
        '1',
        'MINTED',
        15201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15202,
        '${defaultJSON}',
        100,
        '2',
        'MINTED',
        15202,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        15203,
        '${defaultJSON}',
        100,
        '3',
        'MINTED',
        15203,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 15203, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
