import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedTokenErc20At1563804000320 implements MigrationInterface {
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
        201001,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        201001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        202001,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        202001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        203001,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        203001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        204001,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        204001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        205001,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        205001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        211001,
        '${defaultJSON}',
        0,
        '0',
        'MINTED',
        211001,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 211001, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
